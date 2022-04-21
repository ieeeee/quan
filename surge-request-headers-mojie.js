console.log("hitting rewrite header...");

let headers = $request.headers;
headers['User-Agent'] = 'Safari';

$done({ headers });
