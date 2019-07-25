var initWhiteList = [
	"newtab",
	"google",
	"extension"
];

var Block = function () {
	var redirect = "https://www.google.com.tw/";

	this.blockIt = false;
	this.blackUrl = [];
	this.urlRedirect = redirect;
	this.whiteUrl = initWhiteList;
	this.blackMode = true;
	this.whiteMode = false;
}

Block.prototype.createBlack = function () {
	return new Promise(function (resolve, reject) {
		chrome.storage.sync.set({ "blackUrl": "[]" }, function () {
			resolve('createBlack');
		});
	});
}

Block.prototype.createWhite = function () {
	return new Promise(function (resolve, reject) {
		chrome.storage.sync.set({ "whiteUrl": JSON.stringify(initWhiteList) }, function () {
			resolve('createWhite');
		});
	});
}

Block.prototype.createUrltoDB = function () {
	chrome.storage.sync.get("id", function (storage) {

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

	});
};

Block.prototype.getBlackUrl = function () {
	return new Promise(function (resolve, reject) {

		chrome.storage.sync.get("blackUrl", function (storage) {
			if (storage.blackUrl) {
				block.blackUrl = JSON.parse(storage.blackUrl);
				resolve('getBlackUrl');
			} else {
				reject('getBlackUrl not define');
			}
		});

	});
}

Block.prototype.getWhiteUrl = function () {
	chrome.storage.sync.get("whiteUrl", function (storage) {
		if (storage.whiteUrl) {
			block.whiteUrl = JSON.parse(storage.whiteUrl);
		}
	});
}

Block.prototype.blackList = function () {
	chrome.tabs.onHighlighted.addListener((tabIds) => {

		if (block.blockIt == true && block.blackMode == true) {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, (tabs) => {
				var tab = tabs[0];

				var isBlack = block.blackUrl.some((url) => {
					console.log(url);
					return tab.url.indexOf(url) != -1;
				});
				if (isBlack) {
					chrome.tabs.update({ url: 'https://www.google.com.tw/' });
				}
			});
		}

	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

		if (block.blockIt == true && block.blackMode == true) {
			chrome.tabs.query({
				currentWindow: true,
				highlighted: true
			}, (tabs) => {
				var tab = tabs[0];

				if (changeInfo.url == tab.url) {
					var isBlack = block.blackUrl.some((url) => {
						console.log(url);
						return changeInfo.url.indexOf(url) != -1;
					});
					if (isBlack) {
						console.log(isBlack);
						chrome.tabs.update({ url: 'https://www.google.com.tw/' });
					}
				}
			});
		}

	});
}

Block.prototype.whiteList = function () {
	chrome.tabs.onHighlighted.addListener((tabIds) => {

		if (block.blockIt == true && block.whiteMode == true) {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, (tabs) => {
				var tab = tabs[0];

				var isWhite = block.whiteUrl.some((url) => {
					return tab.url.indexOf(url) != -1;
				});
				if (!isWhite) {
					chrome.tabs.update({ url: 'https://www.google.com.tw/' });
				}
			});
		}

	});

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

		if (block.blockIt == true && block.whiteMode == true) {
			chrome.tabs.query({
				currentWindow: true,
				highlighted: true
			}, (tabs) => {
				var tab = tabs[0];

				if (changeInfo.url == tab.url) {
					var isWhite = block.whiteUrl.some((url) => {
						return changeInfo.url.indexOf(url) != -1;
					});
					if (!isWhite) {
						chrome.tabs.update({ url: 'https://www.google.com.tw/' });
					}
				}
			});
		}

	});
}

//Lin

Block.prototype.BWSwitch = () => {
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message == 'change2White') {
			sendResponse('change2White.');
			block.whiteMode = true;
			block.blackMode = false;
		}
	});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message == 'change2Black') {
			sendResponse('change2Black.');
			block.blackMode = true;
			block.whiteMode = false;
		}
	});
}

/* 初始化 */

Block.prototype.createUrl = function (createBlack, createWhite, createDB, getBlack, getWhite, setBlack, setWhite) {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		console.log('createUrl');
		if (request.msg == 'createUrl') {
			createBlack()
			.then(createWhite)
			.then(createDB)
			.then(getBlack)
			.then(getWhite)
			.then(setBlack)
			.then(setWhite);

			sendResponse('done createUrl');
		}		
	});
}

/* storage data to object */

Block.prototype.syncUrl = function (getBlack, getWhite, setBlack, setWhite) {
	getBlack()
		.then(getWhite)
		.then(setBlack)
		.then(setWhite)
		.catch(() => {
			console.log('不執行 syncUrl 改執行 createUrl');
		});
}

var block = new Block();

block.createUrl(
	block.createBlack,
	block.createWhite,
	block.createUrltoDB,
	block.getBlackUrl,
	block.getWhiteUrl,
	block.blackList,
	block.whiteList
);

block.syncUrl(
	block.getBlackUrl,
	block.getWhiteUrl,
	block.blackList,
	block.whiteList
);

block.BWSwitch();