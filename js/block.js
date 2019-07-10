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

		this.highlight = false;
	}
	
	blackList() {
		chrome.webRequest.onBeforeRequest.addListener((details) => {			
			return {redirectUrl: this.urlRedirect};
		},
		{urls: this.blackUrl},
		["blocking"]);
	}

	whiteList() {	
		

		chrome.tabs.onHighlighted.addListener((tabIds) => {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, (tabs) => {				
				var tab = tabs[0];
				
				var isWhite = this.whiteUrl.some((url) => {
					return tab.url.indexOf(url) != -1;
				});				
				if (!isWhite) {
					this.highlight = true;
					chrome.tabs.update({url: this.urlRedirect});
				}
			});
		});
	
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {			
			if (changeInfo.url && this.highlight == false) {
				var isWhite = this.whiteUrl.some((url) => {
					return changeInfo.url.indexOf(url) != -1;
				});				
				if (!isWhite) {
					chrome.tabs.update({url: this.urlRedirect});
				}
			} else {
				this.highlight = true;
			}
		});
	}
}

block = new Block();
block.whiteList();