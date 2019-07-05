class Block {
	
	constructor() {
		var blackList = [
				"*://www.youtube.com/*",
				"*://developer.mozilla.org/*"
			];
		
		var redirect = "https://www.google.com.tw/";

		var whiteList = [
			"google",
			"newtab",
			"extension",
			"youtube"
		]; 

		this.blackUrl = blackList;
		this.urlRedirect = redirect;		
		this.whiteUrl = whiteList;
	}
	
	blackList() {
		chrome.webRequest.onBeforeRequest.addListener((details) => {			
			return {redirectUrl: this.urlRedirect};
		},
		{urls: this.blackUrl},
		["blocking"]);
	}

	whiteList() {		
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {		
			if (changeInfo.url) {
				var isWhite = this.whiteUrl.some((url) => {
					return changeInfo.url.indexOf(url) != -1;
				});				
				if (!isWhite) {
					chrome.tabs.update({url: this.urlRedirect});
				}
			}
		}); 
	}
}

block = new Block();
block.whiteList();