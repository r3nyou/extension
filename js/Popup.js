var storage = chrome.storage.sync;

function setStorage() {
	var value = $('#password').val();
	storage.set({'userID': value}, function() {

	});
}

function getStorage() {
	storage.get('userID', function(items) {
		if (items.userID) {
            if (items.userID == $('#password').val()) {
                alert('login');
            } else {
                alert('fail');
            }            
		}
	});
}

$('#btnSubmit').click(function() {    
    getStorage();
});

$('#btnSet').click(function() {
    setStorage();
});

$('#btnClear').click(function() {    
    chrome.storage.sync.clear(function() {        
    });
});