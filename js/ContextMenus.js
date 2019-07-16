class ContextMenus {

    constructor() {
        this.parent = ["磚注"];
        this.child = ["加入黑名單"];
    }

    createParent() {
        this.parent.forEach((context) => {
            chrome.contextMenus.create({"title": context, "id": "parent"});
        });
    }

    createChild() {
        this.child.forEach((context) => {
            chrome.contextMenus.create({"type": "checkbox", "checked": true, "title": context, "parentId": "parent"});
        });
    }

    onClickHandler() {
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            //console.log("item " + info.menuItemId + " was clicked");
            //console.log("info: " + JSON.stringify(info));
            //console.log("tab: " + JSON.stringify(tab));
            //chrome.runtime.sendMessage("hi");
            this.sendInfo();
        });
    }

    sendInfo() {
        chrome.runtime.sendMessage('Hello', function(response){
            //document.write(response);
            //console.log("aaa" + response);
        });
    }
}

//contextMenus = new ContextMenus();
//contextMenus.createParent();
//contextMenus.createChild();
//contextMenus.onClickHandler();