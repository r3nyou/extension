/* 設定密碼 */

var storage = chrome.storage.sync;

var userID;

function setPWtoDB(password) {

    chrome.storage.sync.get("id", function(storage) {
        if(storage.id === undefined) { 
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
    chrome.storage.sync.set({"password":password}, function() {
        alert('password 新增: ' + password);
    });
}

function getPW() {
    chrome.storage.sync.get("password", function(storage) {
        if(storage.password === undefined) {            
            /*alert('還沒設定密碼');*/
            $("#loginMode").css("display", "none");
            $("#optionMode").css("display", "block");
        } else {
            /*alert('密碼是: ' + storage.password);*/
            $("#loginMode").css("display", "block");
            $("#optionMode").css("display", "none");
        }
    });
}

function login() {
    chrome.storage.sync.get("password", function(storage) {        
        if(storage.password == $('#inputPassword').val()) { 
            $("#loginMode").css("display", "none");
            $("#optionMode").css("display", "block");
        } else {
            alert('Wrong Password!');
        }
    });
}

/* 設定黑名單 & 白名單 */

function setBlackUrl() {
   
    var bgpage = chrome.extension.getBackgroundPage();
    var add = $('#blackInput').val();
    
    bgpage.block.blackUrl.push(add);

    var data = JSON.stringify(bgpage.block.blackUrl);
    chrome.storage.sync.set({"blackUrl":data}, function() {
        updateUrltoDB('blackUrl', data);
    });
    
    alert('新增成功: ' + add);

    $('#blackInput').val('');
}

function setWhiteUrl() {

    var bgpage = chrome.extension.getBackgroundPage();
    var add = $('#whiteInput').val();
    bgpage.block.whiteUrl.push(add);

    //console.log(bgpage.block.whiteUrl);

    var data = JSON.stringify(bgpage.block.whiteUrl);
    chrome.storage.sync.set({"whiteUrl":data}, function() {
        updateUrltoDB('whiteUrl', data);
    });
    
    alert('新增成功: ' + add);

    $('#whiteInput').val('');
}

function getUserID() {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get("id", function(storage) {
            userID = storage.id;
            resolve(userID);
        });
    });
}

function updateUrltoDB(type, newUrl) {
    
    var postData;

    if(userID === undefined) {
        chrome.storage.sync.get("id", function(storage) {
            userID = storage.id;
            updateUrltoDB(type, newUrl);
        });
    } else {
        if(type == 'blackUrl') {
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

$('#btnSet').click(function() {    
    setPWtoDB( $('#password').val() );
});

$('#btnClear').click(function() {    
    chrome.storage.sync.remove("password" , function() {        
    });
});

$('#btnLogin').click(function() {    
    login();
});

$('#blackSet').click(function() {    
    setBlackUrl();
});

$('#whiteSet').click(function() {    
    setWhiteUrl();
});

getPW();

chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
        var storageChange = changes[key];

        console.log('存储键“%s”（位于“%s”命名空间中）已更改。' +
            '原来的值为“%s”，新的值为“%s”。',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue);
	}
});