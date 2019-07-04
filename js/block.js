class Block {
	
	constructor() {
		var blackList = [
				"*://www.youtube.com/*",
				"*://developer.mozilla.org/*"
			];
		
		var redirect = "https://www.google.com.tw/";

		var whiteList = [
			"google.com",
			"youtube.com",
			"mozilla.org"
		]; 

		this.blackUrl = blackList;
		this.urlRedirect = redirect;		
		this.whiteUrl = whiteList;
	}
	
	blackList() {
		chrome.webRequest.onBeforeRequest.addListener((details) => {				
			console.log(details);
			return {redirectUrl: this.urlRedirect};
		},
		{urls: this.blackUrl},
		["blocking"]);
	}

	whiteList() {
		
		chrome.webRequest.onBeforeRequest.addListener((details) => {
		

			var isWhite = this.whiteUrl.some((url) => {
				if (details.initiator != undefined) {
					//console.log(details.initiator.indexOf(url));
					if (details.initiator.indexOf(url) !== -1) {
						
						return true;
					} else {
						return false;
					}										
				} else {
					return true;
				}				
			});

			//console.log(isWhite);
			if (!isWhite) {
				return {redirectUrl: this.urlRedirect};				
			} else {
				return {cancel : false};
			}
			//return {cancel : false}
		},
		{urls: ["<all_urls>"]},
		["blocking"]);		
	}
}

block = new Block();
block.whiteList();