var storage = chrome.storage.sync;

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

function getStorage() {
	storage.get('userID', function(items) {
		if (items.userID) {
            if (items.userID == $('#inputPassword').val()) {                
                $("#loginMode").css("display", "none");
                $("#optionMode").css("display", "block");
            } else {           
                alert("wrong Password!");
            }            
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

// 檢查是否設定密碼
getPW();