let opener = {
    waitMaxTimes: 10,
waitCounts:1
    myRequest: {
        },
    wait: function (ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 500)
        });
    },
    open: function () {
        var that = this;
        new Promise((resolve, reject) => {
            $httpClient.post(that.myRequest, function (error, response, data) {
                let result = { "code": 0, "message": "", "data": null };
                if (error === null && response.status === 200) {
                    let openResult = JSON.parse(data);
                    if (!openResult || !openResult.id) {
                        result.code = -2;
                    }
                    resolve(result);
                } else {
                    result.code = -1;
                    result.message = `request error [${error}]`;
                    reject(result);
                }
            });
        }).then(res => {
            if (res && res.code === 0) {
                $notification.post("开门", "开门脚本", "开门脚本执行 成功");
            } else {
                $notification.post("开门", "开门脚本", "开门脚本执行 出错" + JSON.stringify(res));
            }
        }).catch(err => {
            $notification.post("开门", "开门脚本", "开门脚本执行 异常" + JSON.stringify(err));
        }).finally(function () {
            console.log("End");
            $done({ "status": "ok" });
        });
    },
    getOpenStatus: function (commandId) {
        var that = this;
        return new Promise((resolve, reject) => {
            that.myRequest.url = myRequest.url+ '-result';
            that.myRequest.body = { "commandId": commandId };
try{
$httpClient.get(that.myRequest, function (error, response, data) {
                resolve({ error: error, response: response, data: data });
            });
}
catch(errormsg){
reject(errormsg);
}
            
        });
    },
    queryOpenStatus: function (commandId, rad) {
        var that = this;

        return that.getOpenStatus(commandId).then(res => {
            console.log(`queryOpenStatus~${that.waitMaxTimes}`);
            if (that.waitMaxTimes === rad) {
                res.data.success = true;
            }
            if (res.error === null && res.response.status === 200 && res.data.success) {
                return 1;
            } else {
                if (that.waitMaxTimes < 10) {
                    that.wait(1000).then(result => {
                        console.log(`testWait times [${that.waitMaxTimes++}]`);
                        return that.queryOpenStatus(commandId, rad);
                    });
                } else {
                    console.log(`run testWait times already max [${that.waitMaxTimes}]`);
                    return 0;
                }
            }
        });
    },
queryOpenStatus2:function(commandId){
var that = this;
that.getOpenStatus(commandId)
.then(res=>{
if(res.data){
console.log(`状态已更新 => [${JSON.stingify(res)}]`);
$done();
}
else{
if(that.waitCounts >= that.waitMaxTimes){
console.log(`查询次数超限 => [${that.waitCounts}/${that.waitMaxTimes}]`);
$done();
}
else{
console.log(`状态未更新 => [${that.waitCounts}/${that.waitMaxTimes}]`);
that.wait(1000).then(()=>{
that.queryOpenStatus2();
});
}
}
})
.catch(error=>{})
.finally(function(){
that.waitCounts++;
});
},
    testWait: function (commandId) {
        var that = this;
        if (that.waitMaxTimes < 10) {
            that.wait(1000).then(result => {
                console.log(`testWait times [${that.waitMaxTimes++}]`);
                that.testWait(commandId)
            });
        } else {
            console.log(`run testWait times already max [${that.waitMaxTimes}]`);
            $done();
        }
    }
};

opener.open();
