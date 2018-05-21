//客流汇报定时提醒

var deadlineArr = [12, 14, 16, 18, 20];
var normal = [0, 1, 2, 3, 4];
var spec = [5, 6];

function notice(title, content) {
    console.log("触发通知:" + new Date());
    chrome.notifications.create(null, {
        type: "basic",
        iconUrl: "img/boss.png",
        title: title,
        message: content
    });
}

//1s检查一次
setInterval(function () {
    var curTime = new Date();
    var day = curTime.getDay();
    var hour = curTime.getHours();
    var min = curTime.getMinutes();
    var sec = curTime.getSeconds();
    //例行检查至20点
    if (sec === 0 && min === 0 && deadlineArr.indexOf(hour) !== -1) {
        notice("截止" + hour + "点", "是时候报告老板了！");
    }
    //针对闭店
    //22点闭店，21点50提醒
    if (sec === 0 && min === 50 && hour === 21 && normal.indexOf(day) !== -1) {
        notice("马上22点闭店了", "提前报告老板，早点准备下班吧！");
    }
    //22点30闭店，22点20提醒
    if (sec === 0 && min === 20 && hour === 22 && spec.indexOf(day) !== -1) {
        notice("马上22点30闭店了", "提前报告老板，早点准备下班吧！");
    }

}, 1000 * 1);

