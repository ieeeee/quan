/**
 * vconsole-inject.js
 * Surge http-response 脚本：向 HTML 页面注入 vConsole 调试面板
 *
 * 脚本行示例：
 * [Script]
 * vconsole = type=http-response,pattern=^https://erp-test\.it\.aisuan\.cn/mobile/,requires-body=true,max-size=5242880,script-path=vconsole-inject.js,engine=webview
 */

const DEFAULT_CDN = 'https://unpkg.com/vconsole@3.15.1/dist/vconsole.min.js';
const FLAG = '__VCONSOLE_INJECTED__';

// $argument 在 Surge 中是字符串，这里兼容对象形式
function parseArgument(arg) {
  if (!arg) return {};
  if (typeof arg === 'object') return arg;
  const out = {};
  String(arg).split('&').forEach(function (pair) {
    const i = pair.indexOf('=');
    if (i > 0) {
      out[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent(pair.slice(i + 1));
    }
  });
  return out;
}

const args = parseArgument(typeof $argument !== 'undefined' ? $argument : null);
const cdn = args.cdn || DEFAULT_CDN;

const rawHeaders = $response.headers || {};

function getHeader(name) {
  const key = Object.keys(rawHeaders).find(function (k) {
    return k.toLowerCase() === name;
  });
  return key ? String(rawHeaders[key]) : '';
}

const contentType = getHeader('content-type').toLowerCase();
const body = $response.body;

// 只处理 HTML 文档；二进制、JSON、JS、图片等一律放行
if (typeof body !== 'string' || contentType.indexOf('text/html') === -1) {
  $done({});
} else if (body.indexOf(FLAG) !== -1) {
  // 防止重复注入
  $done({});
} else {
  const snippet =
    '<!--' + FLAG + '-->' +
    '<script src="' + cdn + '"></script>' +
    '<script>' +
    'window.addEventListener("DOMContentLoaded",function(){' +
    'if(window.VConsole&&!window.vConsole){window.vConsole=new window.VConsole({theme:"dark"});}' +
    '});' +
    '</script>';

  let newBody;
  if (/<\/body>/i.test(body)) {
    newBody = body.replace(/<\/body>/i, snippet + '</body>');
  } else if (/<\/head>/i.test(body)) {
    newBody = body.replace(/<\/head>/i, snippet + '</head>');
  } else {
    newBody = snippet + body;
  }

  // 重建响应头：移除 CSP，避免外部 CDN 脚本被拦截
  const headers = {};
  Object.keys(rawHeaders).forEach(function (k) {
    const lower = k.toLowerCase();
    if (lower === 'content-security-policy' || lower === 'content-security-policy-report-only') {
      return;
    }
    headers[k] = rawHeaders[k];
  });

  console.log('[vConsole] injected into ' + $request.url);
  $done({ body: newBody, headers: headers });
}
