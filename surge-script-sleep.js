let authInfo = {
    "url": "http://router.dsm.local/login.cgi",
    "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9,zh-TW;q=0.8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "http://router.dsm.local",
        "Pragma": "no-cache",
        "Referer": "http://router.dsm.local/Main_Login.asp",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    },
    "body": "group_id=&action_mode=&action_script=&action_wait=5&current_page=Main_Login.asp&next_page=index.asp&login_authorization=bXlydDo0b2I3RXNoVHZ5S1VnSEI%3D&login_captcha=",
    "timeout": 5
};

let RTAC88U = {
    myRequest: authInfo,
    loginAndSetting: function () {
        var that = this;
        new Promise((resolve, reject) => {
            $httpClient.post(that.myRequest, function (error, response, data) {
                let result = { code: 0, message: "", data: null };
                if (error === null && response.status === 200) {
                    //获取asus_token
                    let asusToken = response.headers["asus_token"];
                    if (!asusToken) {
                        result.code = -2;
                        result.message = `request error asus_token invalid => ${JSON.stringify(
                            asusToken
                        )}`;
                        reject(result);
                    } else {
                        that.setParentalControl(asusToken, true);
                        resolve(result);
                    }
                } else {
                    result.code = -1;
                    result.message = `request error [${error}]`;
                    reject(result);
                }
            });
        })
            .then((res) => {
                if (res && res.code === 0) {
                    $notification.post("RT-AC88U", "获取登陆凭证", "获取登陆凭证 成功");
                } else {
                    $notification.post(
                        "RT-AC88U",
                        "获取登陆凭证",
                        "获取登陆凭证 出错" + JSON.stringify(res)
                    );
                }
            })
            .catch((err) => {
                $notification.post(
                    "RT-AC88U",
                    "获取登陆凭证",
                    "获取登陆凭证 异常" + JSON.stringify(err)
                );
                $done({ status: "获取登陆凭证:reject" });
            })
            .finally(function () {
                console.log("获取登陆凭证结束");
            });
    },
    setParentalControl: function (asusToken, settingSwitch) {
        //MULTIFILTER_ENABLE
        //2%3E1%3E1
        //2%3E2%3E2
        let MULTIFILTER_ENABLE = settingSwitch ? '2%3E2%3E2' : '2%3E1%3E1';
        var that = this;
        let fetchStatusRequest = {
            "url": "http://router.dsm.local/start_apply.htm",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "zh-CN,zh;q=0.9,zh-TW;q=0.8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": `asus_token=${asusToken}; clickedItem_tab=1`,
                "Origin": "http://router.dsm.local",
                "Pragma": "no-cache",
                "Referer": "http://router.dsm.local/ParentalControl.asp",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            "data": `productid=RT-AC88U&current_page=ParentalControl.asp&next_page=&modified=0&action_wait=5&action_mode=apply&action_script=restart_firewall&firmver=3.0.0.4&MULTIFILTER_ALL=1&MULTIFILTER_ENABLE=${MULTIFILTER_ENABLE}&MULTIFILTER_MAC=3A%3AB8%3A08%3A71%3A25%3A51%3EC4%3A12%3A34%3AD8%3A17%3AAD%3E90%3A32%3A4B%3A7E%3A88%3AB9&MULTIFILTER_DEVICENAME=3A%3AB8%3A08%3A71%3A25%3A51%3EiPadmini6%3ESonyTv&MULTIFILTER_MACFILTER_DAYTIME_V2=%3E%3E&system_time=Mon%2C+Jan+01+19%3A10%3A09+2024&PC_mac=`
        };
        try {
            $httpClient.post(fetchStatusRequest, function (error, response, data) {
                console.log(`配置家长控制结果data => ${JSON.stringify(response.status)}`);
            });
        } catch (error) {
            console.log(`配置家长控制结果try-catch => ${JSON.stringify(error)}`);
        }
    }
};

RTAC88U.loginAndSetting();
