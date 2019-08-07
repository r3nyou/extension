class ContextMenus {

    constructor() {
        this.domainNames = ["com", "info", "net", "org", "xyz", "biz", "biz", "name", "pro", "aero", "asia", "cat", "coop", "edu", "gov", "int", "jobs", "mil", "mobi", "museum", "post", "tel", "travel", "xxx"]
    }

    setBlackUrl() {
        chrome.contextMenus.create({
            "title": "將此網站加入黑名單",
            "contexts": ["all"],
            "onclick": setB
        });

        function setB() {
            chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            }, (tabs) => {
                var tab = tabs[0].url;
                var tabArray = tab.split("/");
                tabArray = tabArray[2].split(".");
                if (tabArray.length == 1) {
                    var tabArray2 = tabArray[tabArray.length - 1];
                } else {
                    var tabArray2 = tabArray[tabArray.length - 2];
                }

                if (contextmenus.domainNames.indexOf(tabArray2) != -1) {
                    tabArray = tabArray[tabArray.length - 3];
                } else {
                    tabArray = tabArray2;
                }

                if (block.blackUrl.indexOf(tabArray) == -1) {
                    block.blackUrl.push(tabArray);
                    alert('新增成功: ' + tabArray);
                    var data = JSON.stringify(block.blackUrl);
                    chrome.storage.sync.set({ "blackUrl": data }, function () {
                        updateUrltoDB('blackUrl', data);
                    });
                } else {
                    alert('已存在於白名單中!');
                }
            });
        }
    }

    setWhiteUrl() {
        chrome.contextMenus.create({
            "title": "將此網站加入白名單",
            "contexts": ["all"],
            "onclick": setW
        });

        function setW() {
            chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            }, (tabs) => {
                var tab = tabs[0].url;
                var tabArray = tab.split("/");
                tabArray = tabArray[2].split(".");
                if (tabArray.length == 1) {
                    var tabArray2 = tabArray[tabArray.length - 1];
                } else {
                    var tabArray2 = tabArray[tabArray.length - 2];
                }

                if (contextmenus.domainNames.indexOf(tabArray2) != -1) {
                    tabArray = tabArray[tabArray.length - 3];
                } else {
                    tabArray = tabArray2;
                }

                if (block.whiteUrl.indexOf(tabArray) == -1) {
                    block.whiteUrl.push(tabArray);
                    alert('新增成功: ' + tabArray);
                    var data = JSON.stringify(block.whiteUrl);
                    chrome.storage.sync.set({ "whiteUrl": data }, function () {
                        updateUrltoDB('whiteUrl', data);
                    });
                } else {
                    alert('已存在於白名單中!');
                }
            });
        }
    }
}
const contextmenus = new ContextMenus();
contextmenus.setBlackUrl();
contextmenus.setWhiteUrl();

var storage = chrome.storage.sync;
var userID;

function updateUrltoDB(type, newUrl) {
    var postData;


    chrome.storage.sync.get("id", function (storage) {
        userID = storage.id;
        updateUrltoDB(type, newUrl);
    });

    if (type == 'blackUrl') {
        postData = JSON.stringify({
            "id": userID,
            "blackUrl": newUrl
        });
    } else if (type == 'whiteUrl') {
        postData = JSON.stringify({
            "id": userID,
            "whiteUrl": newUrl
        });
    }

    var postUrl = 'http://35.201.195.234/extension_backend/api/list/update.php';

    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: postUrl,
        contentType: 'application/json; charset=UTF-8',
        data: postData,
        success: function (msg) {

        }
    });
}