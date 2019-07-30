/* 設定密碼 */

var storage = chrome.storage.sync;

var userID;

function setPWtoDB(password) {

    chrome.storage.sync.get("id", function (storage) {
        if (storage.id === undefined) {
            alert('userID 不存在');
        } else {
            var postData = JSON.stringify({
                "id": storage.id,
                "password": password,
                "email": ""
            });

            var postUrl = 'http://localhost/extension_backend/api/user/update.php';

            $.ajax({
                type: 'PUT',
                dataType: 'json',
                url: postUrl,
                contentType: 'application/json; charset=UTF-8',
                data: postData,
                success: function (msg) {
                    setPW($('#password').val());
                }
            });
        }
    });
}

function setPW(password) {
    chrome.storage.sync.set({ "password": password }, function () {
        alert('password 新增: ' + password);
    });
}

function getPW() {
    chrome.storage.sync.get("password", function (storage) {
        if (bgpage.block.whiteMode) {
            $("#BWSwitch").css("display", "none");
            $("#BWSwitch4White").css("display", "block");
        } else {
            $("#BWSwitch4White").css("display", "none");
            $("#BWSwitch").css("display", "block");
        }
        showBlackList();
        showWhiteList();
        if (storage.password === undefined) {
            /*alert('還沒設定密碼');*/
            $("#loginMode").css("display", "none");
            $("#optionMode").css("display", "block");
            $("#blackInput").focus();
        } else {
            /*alert('密碼是: ' + storage.password);*/
            $("#loginMode").css("display", "block");
            $("#optionMode").css("display", "none");
            $("#inputPassword").focus();
        }
    });
}

function login() {
    chrome.storage.sync.get("password", function (storage) {
        if (storage.password == $('#inputPassword').val()) {
            $("#loginMode").css("display", "none");
            $("#optionMode").css("display", "block");
        } else {
            alert('Wrong Password!');
        }
    });
}

/* 設定黑名單 & 白名單 */
function errInput(add) {
    if (add == "") {
        alert('請輸入網址');
    }

    if (bgpage.block.blackUrl.indexOf(add) != -1) {
        alert('網址已存在');
    }
}

function setBlackUrl() {

    var add = $('#blackInput').val();

    errInput(add);

    if (add != "" && (bgpage.block.blackUrl.indexOf(add) == -1)) {

        bgpage.block.blackUrl.push(add.trim());

        var data = JSON.stringify(bgpage.block.blackUrl);
        chrome.storage.sync.set({ "blackUrl": data }, function () {
            updateUrltoDB('blackUrl', data);
        });

        showBlackList();
        //alert('新增成功: ' + add);
        $('#blackInput').val('');
    }
}

function setWhiteUrl() {

    var add = $('#whiteInput').val();

    errInput(add);

    if (add != "" && (bgpage.block.whiteUrl.indexOf(add) == -1)) {

        bgpage.block.whiteUrl.push(add.trim());

        var data = JSON.stringify(bgpage.block.whiteUrl);
        chrome.storage.sync.set({ "whiteUrl": data }, function () {
            updateUrltoDB('whiteUrl', data);
        });

        showWhiteList();
        //alert('新增成功: ' + add);
        $('#whiteInput').val('');
    }
}

function removeBlackUrl(url) {
    bgpage.block.blackUrl.splice(bgpage.block.blackUrl.indexOf(url), 1);
}

function removeWhiteUrl(url) {
    bgpage.block.whiteUrl.splice(bgpage.block.whiteUrl.indexOf(url), 1);
}

function showBlackList() {
    chrome.storage.sync.get("blackUrl", function (storage) {
        bgpage.block.blackUrl.forEach(element => {
            if (bgpage.block.blackUrl.indexOf(element) == 0)
                $('#blackList').html(spawnLabDeletBtn(element));
            else
                $('#blackList').append(spawnLabDeletBtn(element));
            $(`#${element}`).click(function () {
                removeBlackUrl(element);
                var data = JSON.stringify(bgpage.block.blackUrl);
                chrome.storage.sync.set({ "blackUrl": data }, function () {
                    updateUrltoDB('blackUrl', data);
                });
                showBlackList();
            });
        });
    });
}

function showWhiteList() {
    chrome.storage.sync.get("whiteUrl", function (storage) {
        bgpage.block.whiteUrl.forEach(element => {
            if (bgpage.block.whiteUrl.indexOf(element) == 0)
                $('#whiteList').html(spawnLabDeletBtn(element));
            else
                $('#whiteList').append(spawnLabDeletBtn(element));
            $(`#${element}`).click(function () {
                removeWhiteUrl(element);
                var data = JSON.stringify(bgpage.block.whiteUrl);
                chrome.storage.sync.set({ "whiteUrl": data }, function () {
                    updateUrltoDB('whiteUrl', data);
                });
                showWhiteList();
            });
        });
    });
}

function spawnLabDeletBtn(element) {
    // var str = "<tr><td></td><td>" + element + "</td><td></td><td></td><td>";
    var str = "<tr><td style='padding-left:80px;' colspan='5'>" + element + "</td><td>";
    str += '<button data-toggle="tooltip" id="' + element + '" title="" class="pd-setting-ed"data-original-title="Trash"><i class="fa fa-trash-o"aria-hidden="true"></i></button></td></tr>';
    return str;
}

function getUserID() {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get("id", function (storage) {
            userID = storage.id;
            resolve(userID);
        });
    });
}

function updateUrltoDB(type, newUrl) {

    var postData;

    if (userID === undefined) {
        chrome.storage.sync.get("id", function (storage) {
            userID = storage.id;
            updateUrltoDB(type, newUrl);
        });
    } else {
        if (type == 'blackUrl') {
            postData = JSON.stringify({
                "id": userID,
                "blackUrl": newUrl
            });
        } else if (type == 'whiteUrl') {
            postData = JSON.stringify({
                "id": userID,
                "whiteUrl": newUrl
            });
        }

        var postUrl = 'http://localhost/extension_backend/api/list/update.php';

        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: postUrl,
            contentType: 'application/json; charset=UTF-8',
            data: postData,
            success: function (msg) {

            }
        });
    }
}

$('#inputPassword').keydown((e) => {
    if (e.code == "Enter") {
        login();
    }
});

$('#blackInput').keydown((e) => {
    if (e.code == "Enter") {
        setBlackUrl();
    }
});

$('#whiteInput').keydown((e) => {
    if (e.code == "Enter") {
        setWhiteUrl();
    }
});

$('#btnSet').click(function () {
    setPWtoDB($('#password').val());
});

$('#btnClear').click(function () {
    chrome.storage.sync.remove("password", function () {
    });
});

$('#btnLogin').click(function () {
    login();
});

$('#blackSet').click(function () {
    setBlackUrl();
});

$('#whiteSet').click(function () {
    setWhiteUrl();
});

getPW();

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];

        console.log('儲存鍵“%s”（位於“%s”命名空間中）已更改。' +
            '原來的值為“%s”，新的值為“%s”。',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

//lin area
var bgpage = chrome.extension.getBackgroundPage();
$('#BWSwitch').click(function () {
    BWSwitch()
});
$('#BWSwitch4White').click(function () {
    BWSwitch()
});

function BWSwitch() {
    if (bgpage.block.blackMode) {
        chrome.runtime.sendMessage('change2White', (response) => {
            //$('#mes').html(response);
            //alert(response);
        });
    } else {
        chrome.runtime.sendMessage('change2Black', (response) => {
            //$('#mes').html(response);
            //alert(response);
        });
    }
}
