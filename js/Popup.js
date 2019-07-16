var storage = chrome.storage.sync;

// function setStorage() {
// 	var value = $('#password').val();
// 	storage.set({'userID': value}, function() {

// 	});
// }

function login() {
    chrome.storage.sync.get("password", function(storage) {        
        if(storage.password == $('#inputPassword').val()) { 
            $("#loginMode").css("display", "none");
            $("#startMode").css("display", "block");
        } else {
            alert('Wrong Password!');
        }
    });
}

function getStorage() {    
    chrome.storage.sync.get("id", function(storage) {        
        if($('#password').val() == '1234') { 
            $("#loginMode").css("display", "none");
            $("#startMode").css("display", "block");
        } else {            
            alert('wrong password');
        }
    });
}

function test() {
    chrome.extension.sendMessage({'id': '1234567'}, function(d){
        console.log(d);
    });
}

function getID() {        
    chrome.storage.sync.get("id", function(storage) {        
        if(storage.id === undefined) { 
            setIDtoDB();
        } else {            
            alert('userID 已存在: ' + storage.id);
            return storage.id;
        }
    });
}

function setID(id) {   
    chrome.storage.sync.set({"id":id}, function() {        
        alert('userID 新增: ' + id);        
    });
}

function setIDtoDB(id, password, email) {    

    var postData = JSON.stringify({
        "id": id,
        "password": "",
        "email": ""
    });

    var postUrl = 'http://localhost/extension_backend/api/user/create.php';

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: postUrl,
        contentType: 'application/json; charset=UTF-8',
        data: postData,
        success: function (msg) {
            setID(msg.id);
        }
    });
}

function getPW() {
    chrome.storage.sync.get("password", function(storage) {        
        if(storage.password === undefined) { 
            //setIDtoDB();
            alert('還沒設定密碼');
            $("#loginMode").css("display", "none");
            $("#startMode").css("display", "block");
        } else {
            alert('密碼是: ' + storage.password);
            $("#loginMode").css("display", "block");
            $("#startMode").css("display", "none");
        }
    });
}

$('#btnSubmit').click(function() {    
    login();
});

// $('#btnSet').click(function() {    
//     setIDtoDB();
// });

// $('#btnClear').click(function() {    
//     chrome.storage.sync.clear(function() {        
//     });
// });

// 首次安裝先產生 userID
getID();

// 檢查是否設定密碼
getPW();

//以下屬Lin
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