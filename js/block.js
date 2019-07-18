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

		this.blockIt = false;
		this.blackUrl = blackList;
		this.urlRedirect = redirect;
		this.whiteUrl = whiteList;

		//this.highlight = false;
	}

	blackList() {
		chrome.webRequest.onBeforeRequest.addListener((details) => {
			return { redirectUrl: this.urlRedirect };
		},
			{ urls: this.blackUrl },
			["blocking"]);
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
						chrome.tabs.update({ url: this.urlRedirect });
					}
				});
			}
		});

		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (this.blockIt == true) {
				chrome.tabs.query({
					currentWindow: true,
					highlighted: true
				}, (tabs) => {
					var tab = tabs[0];
					if (changeInfo.url == tab.url) {
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
}

block = new Block();
block.whiteList();