/* 初始化 ID */

var storage = chrome.storage.sync;

function login() {
    chrome.storage.sync.get("password", function (storage) {
        if (storage.password == $('#inputPassword').val()) {
            $("#loginMode").css("display", "none");
            $("#startMode").css("display", "block");
        } else {
            alert('Wrong Password!');
        }
    });
}

function getID() {
    chrome.storage.sync.get("id", function (storage) {
        if (storage.id === undefined) {
            setIDtoDB();
        } else {
            //alert('userID 已存在: ' + storage.id);            
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

    var postUrl = 'http://35.201.195.234/extension_backend/api/user/create.php';

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

function setID(uid) {
    chrome.storage.sync.set({ "id": uid }, function () {
        alert('userID 新增: ' + uid);

        chrome.runtime.sendMessage({ msg: 'createUrl' }, (response) => {
            //$('#mes').html(response);
        });
    });
}

function getPW() {
    chrome.storage.sync.get("password", function (storage) {
        if (bgpage.block.blockIt) {
            //$("#timeDecrease").css("display", "none");
            //$("#timeIncrease").css("display", "none");
            $('#btnStart').html("取消");
        }
        if (storage.password === undefined) {
            // alert('還沒設定密碼');
            $("#loginMode").css("display", "none");
            $("#startMode").css("display", "block");
        } else {
            if (bgpage.block.needPW) {
                //alert('密碼是: ' + storage.password);
                $("#loginMode").css("display", "block");
                $("#startMode").css("display", "none");
                $("#inputPassword").focus();
            }
        }
    });
}

$('#btnSubmit').click(function () {
    login();
});

$('#inputPassword').keydown((e) => {
    if (e.code == "Enter") {
        login();
    }
});

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

        let mode = bgpage.block.whiteMode ? 'whiteUrl' : 'blackUrl';

        let msg = JSON.stringify({
            'mode': mode,
            'timestamp': new Date().getTime(),
            'duration': $('#forDelayInMinutes').html(),
        });
        //console.log(msg);
        bgpage.boardcast("start", msg);

        chrome.storage.sync.set({ "blockStatus": 'start' }, function () {
        });

        chrome.runtime.sendMessage('Hello', (response) => {
            //$('#mes').html(response);
            $('#mes').html(response + ':00');
        });
        //$("#timeDecrease").css("display", "none");
        //$("#timeIncrease").css("display", "none");
        $('#btnStart').html("取消");
    }
}

function stopBloking() {
    if (bgpage.block.blockIt) {

        let msg = JSON.stringify({
            'tmp': 'tmp',
        });
        bgpage.boardcast("stop", msg);

        chrome.storage.sync.set({ "blockStatus": 'stop' }, function () {
        });

        chrome.runtime.sendMessage('Bye', (response) => {
            //$('#mes').html(response);
        });
        //$("#timeDecrease").css("display", "inline");
        //$("#timeIncrease").css("display", "inline");
        $('#btnStart').html("開始");
    }
}

function blockToggle(type) {
    if (type == 'start') {
        //$("#timeDecrease").css("display", "none");
        //$("#timeIncrease").css("display", "none");
        $("#set-area").css("display", "none");
        $("#clock-area").css("display", "block");
        $('#btnStart').html("取消");
    } else if (type == 'stop') {
        //$("#timeDecrease").css("display", "inline");
        //$("#timeIncrease").css("display", "inline");
        $("#set-area").css("display", "block");
        $("#clock-area").css("display", "none");
        $('#btnStart').html("開始");
    }
}

function syncStatus() {
    chrome.storage.sync.get("blockStatus", function (storage) {
        if (storage.blockStatus == 'start') {
            blockToggle(storage.blockStatus);
        }
        console.log(storage.blockStatus);
    });
}

syncStatus();

//$('#forDelayInMinutes').html(bgpage.alarm.alarmInfo.delayInMinutes);

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
        //$('#mes').html(h + ":" + m + ":" + s);
        $('#mes').html(m + ":" + s);
    }
}, 100);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        if (key == 'blockStatus') {
            blockToggle(changes[key].newValue);
        }
    }
});