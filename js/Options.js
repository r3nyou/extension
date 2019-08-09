/* 設定密碼 */

var storage = chrome.storage.sync;
var userID;
var domainNames = ["com", "info", "net", "org", "xyz", "biz", "biz", "name", "pro", "aero", "asia", "cat", "coop", "edu", "gov", "int", "jobs", "mil", "mobi", "museum", "post", "tel", "travel", "xxx"]

function setPWEMtoDB(password_oldPW, email_newPW) {

    chrome.storage.sync.get(null, function (storage) {
        var password = password_oldPW;
        var oldPW = password_oldPW;
        var email = email_newPW;
        var newPW = email_newPW;
        if (storage.id === undefined) {
            alert('userID 不存在');
        } else {
            if (noErrInputForPWEM(password, email) && !bgpage.block.havePW) {
                var postData = JSON.stringify({
                    "id": storage.id,
                    "password": password,
                    "email": email
                });

                var postUrl = 'http://35.201.195.234/extension_backend/api/user/update.php';

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    url: postUrl,
                    contentType: 'application/json; charset=UTF-8',
                    data: postData,
                    success: function (msg) {
                        setPWEM($('#password').val(), $('#email').val());
                    }
                });
            } else if (noErrInputForPW(oldPW, newPW, storage.password) && bgpage.block.havePW) {
                var postData = JSON.stringify({
                    "id": storage.id,
                    "password": newPW,
                    "email": storage.email
                });

                var postUrl = 'http://35.201.195.234/extension_backend/api/user/update.php';

                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    url: postUrl,
                    contentType: 'application/json; charset=UTF-8',
                    data: postData,
                    success: function (msg) {
                        setPWEM($('#oldPW').val(), $('#password').val());
                    }
                });

            }
        }
    });
}

function noErrInputForPWEM(password, email) {
    if (!bgpage.block.havePW) {
        if (password == "") {
            $('#err4PW').html('欄位不能為空');
            var timer = setTimeout(() => {
                $('#err4PW').html('')
                clearInterval(timer);
            }, 3000);
            return false;
        }
        if (email == "") {
            $('#err4EM').html('欄位不能為空');
            var timer = setTimeout(() => {
                $('#err4EM').html('')
                clearInterval(timer);
            }, 3000);
            return false;
        }
        if (!/^[0-9A-Za-z]{4,10}$/.test(password)) {
            //alert('限定英文數字組合，長度4~10');
            $('#err4PW').html('限定英文數字組合，長度4~10');
            var timer = setTimeout(() => {
                $('#err4PW').html('')
                clearInterval(timer);
            }, 3000);
            return false;
        }
        var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if (!emailRule.test(email)) {
            $('#err4PW').html('E-mail格式錯誤');
            var timer = setTimeout(() => {
                $('#err4PW').html('')
                clearInterval(timer);
            }, 3000);
            return false;
        }
        return true;
    }
}

function noErrInputForPW(oldPW, newPW, storagePassword) {
    if (oldPW != storagePassword) {
        $('#err4OldPW').html('與舊密碼不符');
        var timer = setTimeout(() => {
            $('#err4OldPW').html('')
            clearInterval(timer);
        }, 3000);
        return false;
    }
    if (newPW == "") {
        $('#err4NewPW').html('欄位不能為空');
        var timer = setTimeout(() => {
            $('#err4NewPW').html('')
            clearInterval(timer);
        }, 3000);
        return false;
    }
    if (!/^[0-9A-Za-z]{4,10}$/.test(newPW)) {
        //alert('限定英文數字組合，長度4~10');
        $('#err4NewPW').html('限定英文數字組合，長度4~10')
        var timer = setTimeout(() => {
            $('#err4NewPW').html('')
            clearInterval(timer);
        }, 3000);
        return false;
    }
    return true;
}

function setPWEM(password, email_NewPW) {
    if (!bgpage.block.havePW) {
        var email = email_NewPW;
        chrome.storage.sync.set({ "password": password, "email": email }, function () {
            //alert('password 新增: ' + password + '\n email 新增: ' + email);
            alert('新增成功!');
            bgpage.block.havePW = true;
            $('#password').val("");
            $('#email').val("");
            $("#oldPWDiv").css("display", "block");
            $("#emailDiv").css("display", "none");
        });
    } else {
        var NewPW = email_NewPW;

        chrome.storage.sync.set({ "password": NewPW }, function () {
            //alert('new password : ' + NewPW);
            alert('更改成功!');
            bgpage.block.havePW = true;
            $('#oldPW').val("");
            $('#password').val("");
            $("#oldPWDiv").css("display", "block");
            $("#emailDiv").css("display", "none");
        });
    }
}

function getPW() {
    chrome.storage.sync.get("password", function (storage) {
        if (storage.password === undefined) {
            /*alert('還沒設定密碼');*/
            $("#loginMode").css("display", "none");
            $("#optionMode").css("display", "block");
            $("#blackInput").focus();
        } else {
            bgpage.block.havePW = true;
            if (bgpage.block.needPW) {
                /*alert('密碼是: ' + storage.password);*/
                $("#loginMode").css("display", "block");
                $("#optionMode").css("display", "none");
                $("#inputPassword").focus();
            }
        }
        if (bgpage.block.whiteMode) {
            $("#BWSwitch").css("display", "none");
            $("#BWSwitch4White").css("display", "block");
        } else {
            $("#BWSwitch4White").css("display", "none");
            $("#BWSwitch").css("display", "block");
        }
        if (bgpage.block.needPW) {
            $("#PWSwitch").css("display", "block");
            $("#PWSwitch4Off").css("display", "none");
        } else {
            $("#PWSwitch4Off").css("display", "block");
            $("#PWSwitch").css("display", "none");
        }
        if (bgpage.block.havePW) {
            $("#oldPWDiv").css("display", "block");
            $("#emailDiv").css("display", "none");
        } else {
            $("#PWSwitch4Off").css("display", "none");
            $("#PWSwitch").css("display", "none");
        }
        showBlackList();
        showWhiteList();
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

    add = add.split("/");
    if (add.length == 1) {
        add = add[0];
    } else {
        add = add[2].split(".");
        if (add.length == 1) {
            var addTemp = add[add.length - 1];
        } else {
            var addTemp = add[add.length - 2];
        }

        if (domainNames.indexOf(addTemp) != -1) {
            add = add[add.length - 3];
        } else {
            add = addTemp;
        }
    }

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

        let list = JSON.stringify({
            'new list': data,
            'add': add,
        });
        console.log('add blackUrl');
        bgpage.boardcast('add blackUrl', list);
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

        let list = JSON.stringify({
            'new list': data,
            'add': add,
        });
        console.log('add whiteUrl');
        bgpage.boardcast('add whiteUrl', list);
    }
}

function removeBlackUrl(url) {
    bgpage.block.blackUrl.splice(bgpage.block.blackUrl.indexOf(url), 1);

    let data = JSON.stringify({
        'new list': JSON.stringify(bgpage.block.blackUrl),
        'remove': url,
    });
    bgpage.boardcast('update blackUrl', data);
}

function removeWhiteUrl(url) {
    bgpage.block.whiteUrl.splice(bgpage.block.whiteUrl.indexOf(url), 1);

    let data = JSON.stringify({
        'new list': JSON.stringify(bgpage.block.blackUrl),
        'remove': url,
    });
    bgpage.boardcast('update whiteUrl', data);
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
                if (bgpage.block.blackUrl.length == 0)
                    $('#blackList').html("");
                else
                    showBlackList();
            });
        });
    });
}

function showWhiteList() {
    chrome.storage.sync.get("whiteUrl", function (storage) {
        bgpage.block.whiteUrl.forEach(element => {
            if (bgpage.block.whiteUrl.indexOf(element) == 2)
                $('#whiteList').html("");
            else if (bgpage.block.whiteUrl.indexOf(element) == 3)
                $('#whiteList').html(spawnLabDeletBtn(element));
            else
                $('#whiteList').append(spawnLabDeletBtn(element));
            $(`#${element}`).click(function () {
                removeWhiteUrl(element);
                var data = JSON.stringify(bgpage.block.whiteUrl);
                chrome.storage.sync.set({ "whiteUrl": data }, function () {
                    updateUrltoDB('whiteUrl', data);
                });
                if (bgpage.block.whiteUrl.length == 3)
                    $('#whiteList').html("");
                else
                    showWhiteList();
            });
        });
    });
}

function spawnLabDeletBtn(element) {
    // var str = "<tr><td></td><td>" + element + "</td><td></td><td></td><td>";
    var str = "<tr><td colspan='4'>" + element + "</td><td>";
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

        var postUrl = 'http://35.201.195.234/extension_backend/api/list/update.php';

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

$('#oldPW,#password,#email').keydown((e) => {
    if (e.code == "Enter") {
        if (!bgpage.block.havePW) {
            setPWEMtoDB($('#password').val(), $('#email').val());
        } else {
            setPWEMtoDB($('#oldPW').val(), $('#password').val());
        }
    }
});

$('#btnSet').click(function () {
    if (!bgpage.block.havePW) {
        setPWEMtoDB($('#password').val(), $('#email').val());
    } else {
        setPWEMtoDB($('#oldPW').val(), $('#password').val());
    }
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
        switch (key) {
            case 'blackUrl':
                showBlackList();
                break;
            case 'whiteUrl':
                showWhiteList();
                break;
        }

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

$('#PWSwitch').click(function () {
    needPWSwitch()
});
$('#PWSwitch4Off').click(function () {
    needPWSwitch()
});
function needPWSwitch() {
    if (bgpage.block.needPW) {
        chrome.runtime.sendMessage('no need', (response) => {
            //$('#mes').html(response);
            //alert(response);
        });
    } else {
        chrome.runtime.sendMessage('need', (response) => {
            //$('#mes').html(response);
            //alert(response);
        });
    }
}

/** forget password */
$("#forget").on("click", function () {
    chrome.storage.sync.get("id", function (storage) {
        if (storage.id) {
            var getUrl = 'http://35.201.195.234/extension_backend/api/user/get_password.php?id=' + storage.id;
            $.get(getUrl, function (data) {
                //console.log(data);
                sentMail(data.email, data.password)
            });
        }
    });
});

function sentMail(email, password) {
    var getUrl = 'http://104.199.202.192/mailer/sendMail.php?password=' + password + '&email=' + email;
    $.get(getUrl, function (data) {
    });
    alert('請至信箱確認');
}
