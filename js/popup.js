var bgpage = chrome.extension.getBackgroundPage();
var btnTimeDecrease = document.getElementById("time_--");
var btnTimeIncrease = document.getElementById("time_++");
var btnStart = document.getElementById("btn_start");
document.getElementById('forDelayInMinutes').innerHTML = bgpage.alarm.alarmInfo.delayInMinutes;
btnTimeDecrease.addEventListener("click", () => {
  document.getElementById('forDelayInMinutes').innerHTML = (parseInt(document.getElementById('forDelayInMinutes').innerHTML) - 5) <= 10 ? 10 : (parseInt(document.getElementById('forDelayInMinutes').innerHTML) - 5);
  chrome.runtime.sendMessage(document.getElementById('forDelayInMinutes').innerHTML, (response) => {
    document.getElementById('mes').innerHTML = response;

  });
}, false);
btnTimeIncrease.addEventListener("click", () => {
  document.getElementById('forDelayInMinutes').innerHTML = (parseInt(document.getElementById('forDelayInMinutes').innerHTML) + 5) >= 120 ? 120 : (parseInt(document.getElementById('forDelayInMinutes').innerHTML) + 5);
  chrome.runtime.sendMessage(document.getElementById('forDelayInMinutes').innerHTML, (response) => {
    document.getElementById('mes').innerHTML = response;

  });
}, false);
btnStart.addEventListener("click", () => {
  chrome.runtime.sendMessage('Hello', (response) => {
    document.getElementById('mes').innerHTML = response;

  });
}, false);

setInterval(() => {
  if (bgpage.block.blockIt) {
    var h = Math.floor(bgpage.alarm.timeRemaining / 3600);
    var m = Math.floor((bgpage.alarm.timeRemaining % 3600) / 60);
    var s = Math.floor(bgpage.alarm.timeRemaining % 60);
    h = h >= 1 ? h : ('0');
    m = m >= 1 ? m : ('0');
    m = m >= 10 ? m : ('0' + m);
    s = s >= 10 ? s : ('0' + s);
    document.getElementById('mes').innerHTML = h + ":" + m + ":" + s;
  }
}, 100);