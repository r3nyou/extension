var storage = chrome.storage.sync;

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

$('#btnLogin').click(function() {    
    getStorage();
});