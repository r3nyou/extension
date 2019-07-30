document.writeln("<script src='js/socket.io.js'></script>");

const getID = chrome.storage.sync.get("id", function (storage) {
    if (storage.id != undefined) {
        connection(storage.id);
    } else {
        console.log('go to IDListner');
        IDListenr;
    }
});

const IDListenr = chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {   
    
    if (request.msg == 'createUrl') {
        getID;
        sendResponse('socket connected');
    }
    sendResponse('socket connected');    
});


//const uid = Date.parse(new Date());

const connection = function(uid) {

    const socket = io('http://127.0.0.1:3120');

    socket.on('connect', function() {
        socket.emit('login', uid);
    });

    socket.on('new msg', function(content) {
        console.log(content);
    });
};

const broadcast = function() {

};

$( document ).ready(function() {    
    getID;
});