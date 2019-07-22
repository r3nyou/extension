/* 初始化 ID */

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

function setID(id) {   
    chrome.storage.sync.set({"id":id}, function() {        
        alert('userID 新增: ' + id);

        chrome.runtime.sendMessage({msg: 'createUrl', userid: id}, (response) => {
            //$('#mes').html(response);
        });
    });
}

// function getPW() {
//     chrome.storage.sync.get("password", function(storage) {        
//         if(storage.password === undefined) { 
//             //setIDtoDB();
//             alert('還沒設定密碼');
//             $("#loginMode").css("display", "none");
//             $("#startMode").css("display", "block");
//         } else {
//             alert('密碼是: ' + storage.password);
//             $("#loginMode").css("display", "block");
//             $("#startMode").css("display", "none");
//         }
//     });
// }

function getPW() {
    chrome.storage.sync.get("password", function (storage) {
        if (storage.password === undefined) {
            //setIDtoDB();
            alert('還沒設定密碼');
            $("#loginMode").css("display", "none");
            $("#startMode").css("display", "block");
            if (bgpage.block.blockIt) {
                $("#timeDecrease").css("display", "none");
                $("#timeIncrease").css("display", "none");
                $('#btnStart').html("放棄");
            }
        } else {
            //alert('密碼是: ' + storage.password);
            $("#loginMode").css("display", "block");
            $("#startMode").css("display", "none");
            $("#inputPassword").focus();
            if (bgpage.block.blockIt) {
                $("#timeDecrease").css("display", "none");
                $("#timeIncrease").css("display", "none");
                $('#btnStart').html("放棄");
            }
        }
    });
}

$('#btnSubmit').click(function() {    
    login();
});

$('#inputPassword').keydown((e) => {
    if (e.code == "Enter") {
        login();
    }
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

function delayInMinutesDecrease() {
    $('#forDelayInMinutes').html((parseInt($('#forDelayInMinutes').html()) - 5) <= 10 ? 10 : (parseInt($('#forDelayInMinutes').html()) - 5));
    chrome.runtime.sendMessage($('#forDelayInMinutes').html(), (response) => {
        //$('#mes').html(response);
    });
}

function delayInMinutesIncrease() {
    $('#forDelayInMinutes').html((parseInt($('#forDelayInMinutes').html()) + 5) >= 120 ? 120 : (parseInt($('#forDelayInMinutes').html()) + 5));
    chrome.runtime.sendMessage($('#forDelayInMinutes').html(), (response) => {
        //$('#mes').html(response);
    });
}

function startBloking() {
    if (!bgpage.block.blockIt) {
        chrome.runtime.sendMessage('Hello', (response) => {
            //$('#mes').html(response);
        });
        $("#timeDecrease").css("display", "none");
        $("#timeIncrease").css("display", "none");
        $('#btnStart').html("放棄");
    }
}

function stopBloking() {
    if (bgpage.block.blockIt) {
        chrome.runtime.sendMessage('Bye', (response) => {
            $('#mes').html(response);
        });
        $("#timeDecrease").css("display", "inline");
        $("#timeIncrease").css("display", "inline");
        $('#btnStart').html("開始");
    }
}

$('#forDelayInMinutes').html(bgpage.alarm.alarmInfo.delayInMinutes);

$('#timeDecrease').click(() => {
    delayInMinutesDecrease();
});

$('#timeIncrease').click(() => {
    delayInMinutesIncrease();
});

$('#btnStart').click(() => {
    startBloking();
    stopBloking();
});

//永動 
setInterval(() => {
    if (bgpage.block.blockIt) {
        var h = Math.floor(bgpage.alarm.timeRemaining / 3600);
        var m = Math.floor((bgpage.alarm.timeRemaining % 3600) / 60);
        var s = Math.floor(bgpage.alarm.timeRemaining % 60);
        h = h >= 1 ? h : ('0');
        m = m >= 1 ? m : ('0');
        m = m >= 10 ? m : ('0' + m);
        s = s >= 10 ? s : ('0' + s);
        $('#mes').html(h + ":" + m + ":" + s);
    }
}, 100);