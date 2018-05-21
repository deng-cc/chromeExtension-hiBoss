window.onload = function () {
    var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    //复制
    var clipboard = new ClipboardJS('.copy');

    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        e.clearSelection();
        localStorage.clear();
        alert("复制成功");
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
        alert("复制剪切出现错误");
    });

    //加载草稿
    document.getElementById("total_yesterday").value = localStorage.getItem("total_yesterday");
    document.getElementById("total_lastweek").value = localStorage.getItem("total_lastweek");
    document.getElementById("lastYearWeekday").value = localStorage.getItem("lastYearWeekday");
    document.getElementById("total_lastYearWeekday").value = localStorage.getItem("total_lastYearWeekday");

    //监听input blur
    document.getElementById("total_yesterday").onblur = function () {
        localStorage.setItem("total_yesterday", document.getElementById("total_yesterday").value.trim());
    };
    document.getElementById("total_lastweek").onblur = function () {
        localStorage.setItem("total_lastweek", document.getElementById("total_lastweek").value.trim());
    };
    document.getElementById("total_lastYearWeekday").onblur = function () {
        localStorage.setItem("total_lastYearWeekday", document.getElementById("total_lastYearWeekday").value.trim());
    };


    //初始化日期插件
    laydate.render({
        elem: "#lastYearWeekday",
        trigger: "click",
        done: function (value, date, endDate) {
            localStorage.setItem("lastYearWeekday", document.getElementById("lastYearWeekday").value.trim());
        }
    });

    //绑定点击事件
    document.getElementById("reportButton").onclick = function () {
        var total_yesterday = document.getElementById("total_yesterday").value.trim();
        var total_lastweek = document.getElementById("total_lastweek").value.trim();
        var lastYearWeekday = document.getElementById("lastYearWeekday").value.trim();
        var total_lastYearWeekday = document.getElementById("total_lastYearWeekday").value.trim();
        if (lastYearWeekday) {
            var today = new Date();
            var date_lastYearWeekday = new Date(lastYearWeekday.replace(/-/g, '/'));
            //判断年
            if (date_lastYearWeekday.getFullYear() + 1 !== today.getFullYear()) {
                alert("注意：同比年份非去年，同比选择为 " + (date_lastYearWeekday.getFullYear()) + "年");
            }
            //判断月
            if (date_lastYearWeekday.getMonth() !== today.getMonth()) {
                alert("注意：同比月份与当前月份不同，同比选择为 " + (date_lastYearWeekday.getMonth() + 1) + "月");
            }
            //判断星期
            if (date_lastYearWeekday.getDay() !== today.getDay()) {
                alert("注意：同比星期与当前星期不同，同比选择为 " + weekday[date_lastYearWeekday.getDay()]);
            }
        }

        sendMessageToContentScript(
            {
                total_yesterday: total_yesterday,
                total_lastweek: total_lastweek,
                lastYearWeekday: lastYearWeekday,
                total_lastYearWeekday: total_lastYearWeekday
            }, function (res) {
                console.log("response from contentScript：");
                console.log(res);
                document.getElementById("report").innerText = res;
            });
    };

    // 获取当前选项卡ID
    function getCurrentTabId(callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    }

    //发送信息到当前标签页的content-script
    function sendMessageToContentScript(message, callback) {
        getCurrentTabId(function (tabId) {
            chrome.tabs.sendMessage(tabId, message, function (response) {
                if (callback) {
                    callback(response);
                }
            })
        })
    }


    // 向content-script注入JS片段
    function executeScriptToCurrentTab(code) {
        getCurrentTabId(function (tabId) {
            chrome.tabs.executeScript(tabId, {code: code});
        })
    }

    // 向content-script注入JS文件
    function executeScriptFileToCurrentTab(file) {
        getCurrentTabId(function (tabId) {
            chrome.tabs.executeScript(tabId, {file: file});
        })
    }

};