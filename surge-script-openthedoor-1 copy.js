let authInfo = JSON.parse($persistentStore.read("openthedoor_headers_config_key"));
let opener = {
  waitMaxTimes: 10,
  waitCounts: 1,
  myRequest: authInfo,
  timer: [],
  wait: function (ms) {
    var that = this;
    return new Promise((resolve, reject) => {
      let t = setTimeout(resolve, 1000);
      that.timer.push(t);
    });
  },
  clearWaitTimer: function () {
    var that = this;
    that.timer.forEach((element) => {
      clearTimeout(element);
    });
    that.timer = [];
  },
  open: function () {
    var that = this;
    new Promise((resolve, reject) => {
      $httpClient.post(that.myRequest, function (error, response, data) {
        console.log(`开门指令结果 => [${JSON.stringify(data)}]`);
        let result = { code: 0, message: "", data: null };
        if (error === null && response.status === 200) {
          let openResult = JSON.parse(data);
          if (!openResult || !openResult.id) {
            result.code = -2;
            result.message = `request error openResult invalid => ${JSON.stringify(
              openResult
            )}`;
            reject(result);
          } else {
            that.queryOpenStatus2(openResult.id);
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
          $notification.post("开门", "发送开门指令", "发送开门指令 成功");
        } else {
          $notification.post(
            "开门",
            "发送开门指令",
            "发送开门指令 出错" + JSON.stringify(res)
          );
        }
      })
      .catch((err) => {
        $notification.post(
          "开门",
          "发送开门指令",
          "发送开门指令 异常" + JSON.stringify(err)
        );
        $done({ status: "发送开门指令：reject" });
      })
      .finally(function () {
        console.log("开门指令发送结束");
      });
  },
  getOpenStatus: function (commandId) {
    var that = this;
    return new Promise((resolve, reject) => {
      let fetchStatusRequest = {
        url: "https://lggafw.com/v1.5/spmj/door/open-door-result",
        body: JSON.stringify({ commandId: commandId }),
        headers: that.myRequest.headers,
      };
      try {
        $httpClient.post(fetchStatusRequest, function (error, response, data) {
          console.log(`查询开门结果error => ${JSON.stringify(error)}`);
          console.log(`查询开门结果response => ${JSON.stringify(response)}`);
          console.log(`查询开门结果data => ${JSON.stringify(data)}`);
          resolve({ error: error, response: response, data: JSON.parse(data) });
        });
      } catch (error) {
        console.log(`查询开门结果try-catch => ${JSON.stringify(error)}`);
        reject(error);
      }
    });
  },
  queryOpenStatus: function (commandId, rad) {
    var that = this;

    return that.getOpenStatus(commandId).then((res) => {
      console.log(`queryOpenStatus~${that.waitMaxTimes}`);
      if (that.waitMaxTimes === rad) {
        res.data.success = true;
      }
      if (
        res.error === null &&
        res.response.status === 200 &&
        res.data.success
      ) {
        return 1;
      } else {
        if (that.waitMaxTimes < 10) {
          that.wait(1000).then((result) => {
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
  queryOpenStatus2: function (commandId) {
    var that = this;
    that
      .getOpenStatus(commandId)
      .then((res) => {
        if (
          res.error === null &&
          res.response.status === 200 &&
          res.data.success
        ) {
          $notification.post("开门", "查询开门结果", "开门脚本执行 成功");
          console.log(`状态已更新 => [${JSON.stringify(res)}]`);
          $done({ status: "开门脚本执行成功" });
        } else {
          if (that.waitCounts >= that.waitMaxTimes) {
            $notification.post(
              "开门",
              "查询开门结果",
              `查询次数超限 => [${that.waitCounts}/${that.waitMaxTimes}]`
            );
            console.log(
              `查询次数超限 => [${that.waitCounts}/${that.waitMaxTimes}]`
            );
            $done({ status: "查询次数超限" });
          } else {
            console.log(
              `状态未更新 => [${that.waitCounts}/${that.waitMaxTimes}]`
            );
            that.wait(1000).then(() => {
              that.queryOpenStatus2(commandId);
            });
          }
        }
      })
      .catch((error) => {
        console.log(`getOpenStatus.reject => [${JSON.stringify(error)}]`);
        that.wait(1000).then(() => {
          that.queryOpenStatus2(commandId);
        });
      })
      .finally(function () {
        that.waitCounts++;
      });
  },
  testWait: function (commandId) {
    var that = this;
    if (that.waitMaxTimes < 10) {
      that.wait(1000).then((result) => {
        console.log(`testWait times [${that.waitMaxTimes++}]`);
        that.testWait(commandId);
      });
    } else {
      console.log(`run testWait times already max [${that.waitMaxTimes}]`);
      $done();
    }
  },
};

opener.open();
