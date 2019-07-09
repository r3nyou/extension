class User {
    constructor() {
        this.id = null;
    }

    getID() {        
        chrome.storage.sync.get("userID", function(storageID) {
            //console.log("get");
            //console.log(storageID);
            //this.id = storageID;
            
            if (storageID) {
                
                this.id = storageID;
                console.log(this.id);

            } else {
                this.setID();
            }
        });
    }

    setID() {
        var id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        chrome.storage.sync.set({"userID":id}, function() {
            this.id = id;
            console.log(this.id);
        });
    }
}



// chrome.storage.sync.get("userID",function(items) {
//     console.log("get");
//     console.log(items);
// });



// chrome.storage.sync.set({"color":"red"},function() {
//     console.log("set");
//     //string or array of string or object keys
//     chrome.storage.sync.get("color",function(items) {
//         console.log("get");
//         console.log(items);
//     });
// });
