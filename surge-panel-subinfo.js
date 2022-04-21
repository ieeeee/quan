$httpClient.get("https://api.my-ip.io/ip", function(error, response, data){
    $done({
        title: "External IP Address",
        content: data,
    });
});