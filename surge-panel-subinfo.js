const Base64 = new Base64Code();

/*
https://manual.nssurge.com/scripting/common.html
The $persistentStore is for persistent store: 
$persistentStore.write(data<String>, [key<String>])
$persistentStore.read([key<String>])
ariport format:
[{'tag':'xx','url':'http://xxx','style': 'text|percent|percentnum|percentandnum|percentauto'},{'tag':'xx','url':'http://xxx','style': 'text|percent|percentnum|percentandnum|percentauto'}]
style:
    text:机场tag➤  • ↑37.77 MB • ↓5.22 GB • 20GB
    percent:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆ 100%
    percentnum:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆ 30 GB
    percentandnum:机场tag➤ ⋆⋆⋆⋆⋆⋆⋆⋆ 50% [10 GB]
    percentauto:自动切换percent与percentandnum（用量<=50% 时使用percentandnum反之percent）
⚠️注意：percent 风格显示方式受到机场tag字符串长度以及设备尺寸大小影响不建议使用，脚本调试仅针对iPhone12 pro适配
*/
const ariport_config_key = "ariport_amounts_config_key";
const ariportValue = $persistentStore.read(ariport_config_key) || "";
console.log(`ariport_config_key:${ariportValue}`);

/**
 * 构建出多个异步请求（每个异步请求都应该是一个Promise对象）
 */
const ariport = JSON.parse(ariportValue) || [];
const promises = ariport.map((item) => {

    console.log(`[${item.tag}]用量信息查询中...`);

    // 执行异步请求，返回一个 Promise 对象
    return new Promise((resolve, reject) => {
        try {
            let requestOpt = {
                url: item.url,
                headers: {
                    'User-Agent': "Quantumult%20X"
                },
            };
            $httpClient.head(requestOpt, function (error, resp, data) {
                if (error === null) {
                    let header = Object.keys(resp.headers).find((key) => key.toLowerCase() === "subscription-userinfo");
                    resolve({ 'tag': item.tag, 'style': item.style, 'amounts': (header) ? resp.headers[header] : null });
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            console.log(`[${item.tag}]用量信息查询出错...`);
            resolve(null);
        }
    });
});

Promise.all(promises).then((result) => {

    console.log(`[${ariport.length}]用量信息查询完成`);

    const myResponseList = [];

    // 遍历所有请求的响应结果
    for (let response of result) {
        if (response) {
            let tmp = Object.fromEntries(
                response.amounts
                    .match(/\w+=[\d.eE+]+/g)
                    .map((item) => item.split("="))
                    .map(([k, v]) => [k, Number(v)])
            );

            let tag = [];
            let separator = ' • ';
            tag.push(response.tag + '➤ ');

            response.style = response.style || 'text';
            switch (response.style) {
                case "percent":
                case "percentnum":
                case "percentandnum":
                case "percentauto":
                    separator = '';
                    //用量÷总量×100=百分比
                    let amounts = tmp.download + tmp.upload;
                    let total = tmp.total;
                    let percent_amounts = (amounts / total) * 100;
                    let percent_remainder = 100 - percent_amounts;

                    //屏幕可展示100% 的点数为70点[.]/或者32星[⋆]
                    let dotCount = (percent_remainder * 32) / 100;
                    for (let i = 0; i < dotCount; i++) {
                        tag.push(`⋆`);
                    }

                    if (response.style === 'percent') {
                        tag.push(` ${percent_remainder.toFixed(2)}%`);
                    } else if (response.style === 'percentnum') {
                        tag.push(` ${bytesToSize(tmp.total - (tmp.download + tmp.upload))}`);
                    } else if (response.style === 'percentandnum') {
                        tag.push(` ${percent_remainder.toFixed(2)}% [${bytesToSize(tmp.total - (tmp.download + tmp.upload))}] `);
                    } else if (response.style === 'percentauto') {
                        if (percent_remainder <= 50) {
                            tag.push(` ${percent_remainder.toFixed(2)}% [${bytesToSize(tmp.total - (tmp.download + tmp.upload))}] `);
                        }
                        else {
                            tag.push(` ${percent_remainder.toFixed(2)}%`);
                        }
                    }

                    separator = '';
                    break;
                default:
                    tag.push(`↑${bytesToSize(tmp.upload)}`);
                    tag.push(`↓${bytesToSize(tmp.download)}`);
                    tag.push(`${bytesToSize(tmp.total - (tmp.download + tmp.upload))}`);
                    //tag.push(`${bytesToSize(tmp.total)}`);
                    break;
            }

            //魔戒•↑12.91MB•↓12.91MB•11.02GB • ☠︎ ⌘ ● ☛ ➤  
            //∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙∙
            //⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃
            //▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎▪︎
            //......................
            //₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋
            //······················
            //⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆⋆

            myResponseList.push(`${tag.join(separator)}`);
        }
    }

    $done({
        title: "订阅用量查询",
        icon: "doc.text.magnifyingglass",
        'icon-color': "#3498DB",
        content: myResponseList.join('\n')
    });

}).catch((error) => {
    console.log(`Promise.all exception: ${error}`);
    $done({
        title: "订阅用量查询",
        icon: "doc.text.magnifyingglass",
        'icon-color': "#3498DB",
        content: '查询失败...'
    });
});

function bytesToSize(bytes) {
    if (bytes === 0) return "0B";
    let k = 1024;
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatTime(time) {
    let dateObj = new Date(time);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
    return year + "年" + month + "月" + day + "日";
}

//比较完美的一款 base64 encode/decode 工具
/*
 *  base64.js: https://github.com/dankogai/js-base64#readme
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
//base64 完毕
function Base64Code() {
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function (c) {
        if (c.length < 2) {
            let cc = c.charCodeAt(0);
            return cc < 0x80 ? c : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            let cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function (u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function (ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    // var _encode = function(u) {
    //  var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
    //  return isUint8Array ? u.toString('base64')
    //    : btoa(utob(String(u)));
    // }
    this.encode = function (u) {
        var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
        return isUint8Array ? u.toString('base64')
            : btoa(utob(String(u)));
    };
    var uriencode = function (u, urisafe) {
        return !urisafe ? _encode(u)
            : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function (u) { return uriencode(u, true); };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function (cccc) {
        switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    | ((0x3f & cccc.charCodeAt(1)) << 12)
                    | ((0x3f & cccc.charCodeAt(2)) << 6)
                    | (0x3f & cccc.charCodeAt(3)),
                    offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    | (0x3f & cccc.charCodeAt(2))
                );
            default:
                return fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    | (0x3f & cccc.charCodeAt(1))
                );
        }
    };
    var btou = function (b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function (cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [
                fromCharCode(n >>> 16),
                fromCharCode((n >>> 8) & 0xff),
                fromCharCode(n & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = function (a) {
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function (a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    // var _decode = buffer ?
    //  buffer.from && Uint8Array && buffer.from !== Uint8Array.from
    //  ? function(a) {
    //    return (a.constructor === buffer.constructor
    //        ? a : buffer.from(a, 'base64')).toString();
    //  }
    //  : function(a) {
    //    return (a.constructor === buffer.constructor
    //        ? a : new buffer(a, 'base64')).toString();
    //  }
    //  : function(a) { return btou(_atob(a)) };
    var _decode = function (u) {
        return btou(_atob(u));
    };

    this.decode = function (a) {
        return _decode(
            String(a).replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/'; })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        ).replace(/&gt;/g, ">").replace(/&lt;/g, "<");
    };
}
