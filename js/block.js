/*
class Block {
	
	constructor() {
		// var blackList = [
		// 		"*://www.youtube.com/*",
		// 		"*://developer.mozilla.org/*"
		// 	];

		var blackList = [
			"youtube",
			"mozilla",
			"hackmd"
		];
		
		var redirect = "https://www.google.com.tw/";

		var whiteList = [
			"google",
			"newtab",
			"extension",
			"youtube"
		]; 

		this.blockIt = false;
		this.blackUrl = [];
		this.urlRedirect = redirect;		
		this.whiteUrl = whiteList;

		//this.highlight = false;
	}


	
	// blackList() {
	// 	chrome.webRequest.onBeforeRequest.addListener((details) => {			
	// 		return {redirectUrl: this.urlRedirect};
	// 	},
	// 	{urls: this.blackUrl},
	// 	["blocking"]);
	// }

	
	blackList() {		
		chrome.tabs.onHighlighted.addListener((tabIds) => {			
			if (this.blockIt == true || 1==1) {
				chrome.tabs.query({
					active: true,
					lastFocusedWindow: true
				}, (tabs) => {				
					var tab = tabs[0];
					
					var isBlack = this.blackUrl.some((url) => {						
						return tab.url.indexOf(url) != -1;
					});					
					if (isBlack) {
						//this.highlight = true;
						chrome.tabs.update({url: this.urlRedirect});
					}
				});
			}
		});
	
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {	
			if (this.blockIt == true  || 1==1) {
				chrome.tabs.query({
					currentWindow: true,
					highlighted:true
				}, (tabs) => {
					var tab = tabs[0];
					if (changeInfo.url == tab.url ) {
						var isBlack = this.blackUrl.some((url) => {							
							return changeInfo.url.indexOf(url) != -1;
						});						
						if (isBlack) {
							chrome.tabs.update({ url: this.urlRedirect });
						}
					}
				});
			}
		});
	}

	whiteList() {
		chrome.tabs.onHighlighted.addListener((tabIds) => {
			if (this.blockIt == true) {
				chrome.tabs.query({
					active: true,
					lastFocusedWindow: true
				}, (tabs) => {				
					var tab = tabs[0];
					
					var isWhite = this.whiteUrl.some((url) => {
						return tab.url.indexOf(url) != -1;
					});				
					if (!isWhite) {
						//this.highlight = true;
						chrome.tabs.update({url: this.urlRedirect});
					}
				});
			}
		});
	
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {			
			if (this.blockIt == true) {
				chrome.tabs.query({
					currentWindow: true,
					highlighted:true
				}, (tabs) => {
					var tab = tabs[0];
					if (changeInfo.url == tab.url ) {
						var isWhite = this.whiteUrl.some((url) => {
							return changeInfo.url.indexOf(url) != -1;
						});
						if (!isWhite) {
							chrome.tabs.update({ url: this.urlRedirect });
						}
					}
				});
			}
		});
	}

	getBlackUrl() {
		chrome.storage.sync.get("blackUrl", function(storage) {        
			if(storage.blackUrl) {
				this.blackUrl = JSON.parse(storage.blackUrl);
				//console.log('getBlackUrl');
			}
		});
	}
}

block = new Block();

block.getBlackUrl();
block.blackList();
*/

var userID;

var initWhiteList = [
	"newtab",
	"google",			
	"extension"
];

var Block = function() {	
	var redirect = "https://www.google.com.tw/";

	this.blockIt = false;
	this.blackUrl = [];
	this.urlRedirect = redirect;		
	this.whiteUrl = initWhiteList;
}

Block.prototype.createBlack = function() {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.set({"blackUrl":"[]"}, function() {  
			resolve('createBlack');
		});
	});
}

Block.prototype.createWhite = function() {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.set({"whiteUrl":JSON.stringify(initWhiteList)}, function() {
			resolve('createWhite');
		});
	});
}

Block.prototype.createUrltoDB = function() {

	chrome.storage.sync.get("id", function(storage) {

		var postData = JSON.stringify({
			"id": storage.id,
			"blackUrl": "[]",
			"whiteUrl": JSON.stringify(initWhiteList)
		});
		
		var postUrl = 'http://localhost/extension_backend/api/list/create.php';
	
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: postUrl,
			contentType: 'application/json; charset=UTF-8',
			data: postData,
			success: function (msg) {
				
			}
		});
	
		userID = storage.id;
	});
};

Block.prototype.getBlackUrl = function(create, blackList, whiteList) {	
	chrome.storage.sync.get("blackUrl", function(storage) {
		if(storage.blackUrl) {			
			this.blackUrl = JSON.parse(storage.blackUrl);
		} 
	});	
}

Block.prototype.getWhiteUrl = function(whiteList) {
	chrome.storage.sync.get("whiteUrl", function(storage) {
		if(storage.whiteUrl) {			
			this.whiteUrl = JSON.parse(storage.whiteUrl);			
		} 
	});	
}

Block.prototype.blackList = function() {	
	chrome.tabs.onHighlighted.addListener((tabIds) => {			
		if (this.blockIt == true) {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, (tabs) => {				
				var tab = tabs[0];

				var isBlack = this.blackUrl.some((url) => {
					return tab.url.indexOf(url) != -1;
				});
				if (isBlack) {
					chrome.tabs.update({url: 'https://www.google.com.tw/'});
				}
			});
		}
	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {	
		if (this.blockIt == true) {
			chrome.tabs.query({
				currentWindow: true,
				highlighted:true
			}, (tabs) => {
				var tab = tabs[0];

				if (changeInfo.url == tab.url ) {
					var isBlack = this.blackUrl.some((url) => {
						console.log(url);
						return changeInfo.url.indexOf(url) != -1;
					});					
					if (isBlack) {
						console.log(isBlack);
						chrome.tabs.update({ url: 'https://www.google.com.tw/'});
					}
				}
			});
		}
	});
}

Block.prototype.whiteList = function() {
	chrome.tabs.onHighlighted.addListener((tabIds) => {
		if (this.blockIt == true) {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, (tabs) => {
				var tab = tabs[0];
				
				var isWhite = this.whiteUrl.some((url) => {				
					return tab.url.indexOf(url) != -1;
				});				
				if (!isWhite) {					
					chrome.tabs.update({url: 'https://www.google.com.tw/'});
				}
			});
		}
	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {			
		if (this.blockIt == true) {
			chrome.tabs.query({
				currentWindow: true,
				highlighted:true
			}, (tabs) => {
				var tab = tabs[0];

				if (changeInfo.url == tab.url ) {
					var isWhite = this.whiteUrl.some((url) => {
						return changeInfo.url.indexOf(url) != -1;
					});
					if (!isWhite) {
						chrome.tabs.update({ url: 'https://www.google.com.tw/'});
					}
				}
			});
		}
	});
}

Block.prototype.createUrl = function(createBlack, createWhite, createDB, getBlack, getWhite, setBlack, setWhite) {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.msg == 'createUrl') {	

			createBlack()
			.then(createWhite)
			.then(createDB)
			.then(getBlack)
			.then(getWhite)
			.then(setBlack)
			.then(setWhite);
		}
		sendResponse('done createUrl');
	});
}

var block = new Block();
// block.getBlackUrl(block.blackList, block.createUrltoDB);
// block.getWhiteUrl(block.whiteList);

//block.setUrl(block.createUrltoDB, block.blackList, block.whiteList);

block.createUrl(
		block.createBlack,
		block.createWhite,
		block.createUrltoDB,
		block.getBlackUrl,
		block.getWhiteUrl,
		block.blackList,
		block.whiteList
	);