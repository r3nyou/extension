document.writeln("<script src='js/socket.io.js'></script>");

const bgpage = chrome.extension.getBackgroundPage();
let uid = null;

const getID = chrome.storage.sync.get("id", function (storage) {
    if (storage.id != undefined) {
        connection(storage.id);
        uid = storage.id;
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

let socket = null;
const connection = function(uid) {

    socket = io('http://192.168.1.101:3120');

    socket.on('connect', function() {
        socket.emit('login', uid);
    });

    socket.on('new msg', function(content) {
        console.log(content);
        execute(content.replace(/&quot;/g,'"'));   
    });

    socket.on('sync status', function (content) {     
        console.log('sync' + content.replace(/&quot;/g,'"'));
        //syncDevice(content);
    });
};

function boardcast(cmd, msg) {
    let content = JSON.stringify({
        'cmd': cmd,
        'msg': msg,
    });

    let data = JSON.stringify({
        'to': uid,
        'content': content,
    });
    socket.emit('device msg', data);
}

function execute(content) {
    let data = JSON.parse(content);
    let msg = JSON.parse(data.msg);
    let rmvIndex = -1;

    switch(data.cmd) {        
        case 'update blackUrl':
            rmvIndex = bgpage.block.blackUrl.indexOf(msg.remove);
            if (rmvIndex != -1) {
                bgpage.block.blackUrl.splice(rmvIndex, 1);
                chrome.storage.sync.set({ "blackUrl": JSON.stringify(bgpage.block.blackUrl) }, function () {
                });
            }
            break;

        case 'update whiteUrl':            
            rmvIndex = bgpage.block.whiteUrl.indexOf(msg.remove);
            if (rmvIndex != -1) {
                bgpage.block.whiteUrl.splice(rmvIndex, 1);
                chrome.storage.sync.set({ "whiteUrl": JSON.stringify(bgpage.block.whiteUrl) }, function () {
                });
            }
            break;

        case 'add blackUrl':            
            bgpage.block.blackUrl.push(msg.add);
            chrome.storage.sync.set({ "blackUrl": JSON.stringify(bgpage.block.blackUrl) }, function () {
            });
            break;

        case 'add whiteUrl':
            bgpage.block.whiteUrl.push(msg.add);
            chrome.storage.sync.set({ "whiteUrl": JSON.stringify(bgpage.block.whiteUrl) }, function () {
            });
            break;
        
        case 'start':
            chrome.storage.sync.set({ "blockStatus": 'start' }, function () {
            });
            if(msg.mode == 'whiteUrl') {
                bgpage.block.whiteMode = true;
                bgpage.block.blackMode = false;
            } else if (msg.mode == 'blackUrl') {
                bgpage.block.whiteMode = false;
                bgpage.block.blackMode = true;
            }
            alarm.start(msg.duration);
            break;
        
        case 'stop':
            chrome.storage.sync.set({ "blockStatus": 'stop' }, function () {
            });
            alarm.stop();
            break;
    }
}

$( document ).ready(function() {    
    getID;
});