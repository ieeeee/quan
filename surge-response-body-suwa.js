$done({
    status: 200,
    headers: $response.headers,
    body: $response.body.replace(/v1\|/g, `${$request.url.match(/[0-9a-zA-Z]{16}/g)[0].substr(-2)}|`)
});