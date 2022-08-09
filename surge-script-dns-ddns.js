/*$network = {
    "cellular-data": {
        "carrier": "460-11",
        "radio": "NR"
    },
    "wifi": {
        "bssid": null,
        "ssid": null
    },
    "v4": {
        "primaryAddress": "",
        "primaryRouter": "",
        "primaryInterface": ""
    },
    "dns": [
        "240e:1f:1::1",
        "240e:1f:1::33",
        "202.96.128.86",
        "202.96.134.133"
    ],
    "v6": {
        "primaryAddress": "",
        "primaryInterface": ""
    }
}*/

if ($network.wifi.ssid && $network.wifi.ssid === 'MyNetwork5') {
    $done({ addresses: '192.168.50.109', ttl: 600 });
}
else {
    // Fallback to standard DND query
    $done({});
}


