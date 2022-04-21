/**
 * @fileoverview Example of HTTP rewrite of request header.
 *
 * @supported Quantumult X (v1.0.5-build188)
 *
 * [rewrite_local]
 * ^http://example\.com/resource9/ url script-request-header sample-rewrite-request-header.js
 */

// $request.scheme, $request.method, $request.url, $request.path, $request.headers
var modifiedHeaders = $request.headers;

if ($request.headers["User-Agent"].indexOf("Surge") >= 0) {
    modifiedHeaders['User-Agent'] = 'Safari';
    modifiedHeaders['forSurge'] = '1';
}

$done({ headers: modifiedHeaders });
// $done({path : modifiedPath});
// $done({}); // Not changed.
