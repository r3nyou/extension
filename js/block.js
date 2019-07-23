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
		this.blackMode = true;
		this.urlRedirect = redirect;
		this.whiteUrl = whiteList;
		this.whiteMode = false;

		//this.highlight = false;
	}

	blackList() {
		chrome.webRequest.onBeforeRequest.addListener((details) => {
			if (this.blackMode) {
				if (this.blockIt == true) {
					return { redirectUrl: this.urlRedirect };
				}
			}
		},
			{ urls: this.blackUrl },
			["blocking"]);
	}

	whiteList() {
		chrome.tabs.onHighlighted.addListener((tabIds) => {
			if (this.whiteMode) {
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
			}
		});

		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (this.whiteMode) {
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
			}
		});
	}

	BWSwitch() {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message == 'change2White') {
				sendResponse('change2White.');
				this.whiteMode = true;
				this.blackMode = false;
			}
		});

		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message == 'change2Black') {
				sendResponse('change2Black.');
				this.blackMode = true;
				this.whiteMode = false;
			}
		});
	}
}

block = new Block();
block.blackList();
block.whiteList();
block.BWSwitch();