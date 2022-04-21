console.log("hitting rewrite header...");
console.log(JSON.stringify($request.headers));

let headers = $request.headers;
headers['User-Agent'] = 'Safari';

$done({ headers });
