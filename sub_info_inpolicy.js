
/**
 * @fileoverview Example to compose HTTP request
 * and handle the response.
 *
 

const url = "https://example.com/";
const method = "POST";
const headers = {"Field": "test-header-param"};
const data = {"info": "abc"};

const myRequest = {
    url: url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: JSON.stringify(data) // Optional.
};

$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body
    console.log(response.body);
    $notify("Title", "Subtitle", response.body); // Success!
    $done();
}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
    $done();
});
*/


// You can visit through http://quantumult-x:9999/example/v1/ or http://127.0.0.1:9999/example/v1/ or http://localhost:9999/example/v1/


// The availabel variables: $request.url, $request.path, $request.headers, $request.body, $prefs, $task, $notify(title, subtitle, message), console.log(message), $done(response)


//http://quantumult-x:9999/test/?suburl=asdfghjkl




const url = "c";
const method = "HEAD";

const myRequest = {
    url: url,
    method: method, // Optional, default GET.
};


$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body

   //console.log(JSON.stringify(response));

   // $notify("Title", "Subtitle", ''); // Success!
    //$done();

//shadowsocks=k3.7hh7.xyz:41321, method=aes-128-gcm, password=b92946d49005, obfs=http, obfs-host=6573767766736d733a627775.sina.cn, tag=v1|亚洲03|MPTCP|★★☆

/*{"statusCode":200,"headers":{"Server":"nginx","Content-Type":"application/octet-stream; charset=utf-8","Subscription-Userinfo":"upload=4595409; download=10966755; total=16106127360; expire=1676048405","Connection":"keep-alive","Date":"Fri, 15 Apr 2022 01:20:21 GMT","Content-Disposition":"attachment; filename=QuantumultX_1649985621.txt","Content-Length":"7847","Cache-Control":"no-store, no-cache, must-revalidate","X-Cache-Status":"MISS"}}*/


//vmess=gtm.mj-cn.cyou:16617,method=chacha20-poly1305,password=d83dae3e-c0ec-4aa2-9336-67ae5dd7d04c,fast-open=true,udp-relay=true,tag=日本-智能,obfs=ws


//http=hello:80, username=name, password=pwd, fast-open=false, udp-relay=false, tag=DISABLED-PROXY
const Base64=new Base64Code();



const myResponse = {
    status: "HTTP/1.1 200 OK",
    headers: {"Subscription-Userinfo":response.headers["subscription-userinfo"],"Connection": "Close","Content-Type":"text/html; charset=UTF-8"},
    body:Base64.encode("vmess=gtm.mj-cn.cyou:16617,method=chacha20-poly1305,password=d83dae3e-c0ec-4aa2-9336-67ae5dd7d04c,fast-open=true,udp-relay=true,tag=日本-智能,obfs=ws")
};



console.log(Base64.decode(myResponse.body));

$done(myResponse);



}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
    $done();
});



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
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                        + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                        + fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | (cc & 0x3f)));
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
    }
    var uriencode = function (u, urisafe) {
        return !urisafe
            ? _encode(u)
            : _encode(String(u)).replace(/[+\/]/g, function (m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function (u) { return uriencode(u, true) };
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
                return (fromCharCode((offset >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
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
        return btou(_atob(u))
    }
    this.decode = function (a) {
        return _decode(
            String(a).replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        ).replace(/&gt;/g, ">").replace(/&lt;/g, "<");
    };
}
