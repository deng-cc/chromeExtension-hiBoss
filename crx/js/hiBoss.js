window.onload = function () {

    //监听通信
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("request from popup:");
        console.log(request);
        sendResponse(hiBoss(request));
    });

    function dayToStr(day) {
        var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        var result = "";
        if (day) {
            result = day.getMonth() + 1 + "." + (day.getDate() < 10 ? "0" + day.getDate() : day.getDate()) + "/" + weekday[day.getDay()];
        } else {
            result = "{date}/{weekday}";
        }
        console.log(result);
        return result;
    }

    function curTimeStr() {
        var result = "目前";
        var curTime = new Date();
        var curHour = curTime.getHours();
        var curMin = curTime.getMinutes();
        //21点40之后都算闭店
        if (curHour > 21 && curMin > 40) {
            result = "闭店";
        } else {
            //当前分钟小于20，则算当前小时数，如12:18算为12点
            if (curMin < 20) {
                result = curHour + "点";
            }
            //当前分钟大于45，则算下个小时数，如12:47算为13点
            if (curMin > 45) {
                result = curHour + 1 + "点";
            }
        }
        return result;
    }


    function hiBoss(params) {
        var day = new Date();
        var todayStr = dayToStr(day);
        day.setDate(day.getDate() - 1);
        var yesterdayStr = dayToStr(day);
        day.setDate(day.getDate() - 6);
        var lastweekdayStr = dayToStr(day);
        var lastYearWeekday = params["lastYearWeekday"];
        var total_lastYearWeekday = params["total_lastYearWeekday"];
        var lastYearWeekdayStr = lastYearWeekday ? dayToStr(new Date(lastYearWeekday)) : dayToStr("");

        var result = "尊敬的领导：截止" + curTimeStr() + "\n德阳万达客流情况如下：\n今日 " + todayStr + "：{total}人次；滞留人数：{remain}人次\n昨日 " + yesterdayStr + "：" + (params['total_yesterday'] ? params['total_yesterday'] : "{total_yesterday}") + "人次\n上周 " + lastweekdayStr + "：" + (params['total_lastweek'] ? params['total_lastweek'] : "{total_lastweek}") + "人次\n同比 " + lastYearWeekdayStr + "：" + (params['total_lastYearWeekday'] ? params['total_lastYearWeekday'] : "{total_lastYearWeekday}") + "人次\n" + "--------------------------\n今日主力店客流情况如下：";
        var nameIdx = 1;
        var countInIdx = 2;
        var countReIdx = 4;
        var trs = document.getElementsByTagName("tr");
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].children;
            var type = tds[0].innerText.trim();
            //统计总数
            if (type === "德阳万达广场") {
                var total = tds[countInIdx].innerText;
                var remain = tds[countReIdx].innerText;
                result = result.replace("{total}", total);
                result = result.replace("{remain}", remain);
            }
            //统计主力门店
            if (type === "主力店") {
                var name = tds[nameIdx].innerText;
                var count = tds[countInIdx].innerText;
                result += "\n" + name + count + "人次";
            }
        }
        return result;
    }

};






