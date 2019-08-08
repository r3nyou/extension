class Alarm {
    
    constructor() {
        this.timeStart = 0;
        this.timeNow = 0;
        this.timeRemaining = 0;
        this.alarmInfo = {
            delayInMinutes: 25,
        };
        this.timerId = 0;
    }

    alarm() {
        this.timeStart = 0;
        this.timeNow = 0;
        //var timerId = 0;
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (parseInt(message) <= 120 && parseInt(message) >= 10) {
                sendResponse('Hello.');
                this.alarmInfo.delayInMinutes = parseInt(message);
            }
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message == 'Hello') {                
                //sendResponse('Hello from background.');
                sendResponse(this.alarmInfo.delayInMinutes);

                block.blockIt = true;
                this.timeStart = Date.now() / 1000;
                chrome.alarms.create('anAlarm', this.alarmInfo);

                let data = JSON.stringify({
                    'timestap': Date.now(),
                    'duration': this.alarmInfo.delayInMinutes
                });
                chrome.storage.sync.set({ "blockduration": data }, function () {
                });

                chrome.alarms.onAlarm.addListener(() => {
                    block.blockIt = false;

                    chrome.storage.sync.set({ "blockduration": 'stop', "blockStatus":'stop'}, function () {
                    }); 
                });
                this.timerId = setInterval(() => {
                    this.timeNow = Date.now() / 1000;
                    this.timeRemaining = this.alarmInfo.delayInMinutes * 60 - (this.timeNow - this.timeStart);
                }, 100);
            }
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message == 'Bye') {
                //sendResponse('Bye from background.');
                sendResponse(this.alarmInfo.delayInMinutes);
                block.blockIt = false;
                clearInterval(this.timerId);

                chrome.storage.sync.set({ "blockduration": 'stop', "blockStatus":'stop'}, function () {
                });                
                
                chrome.alarms.clearAll();
            }
        });
    }

    start(duration) {
        this.alarmInfo.delayInMinutes = duration;

        block.blockIt = true;
        this.timeStart = Date.now() / 1000;
        chrome.alarms.create('anAlarm', this.alarmInfo);
        
        let data = JSON.stringify({
            'timestap': Date.now(),
            'duration': duration
        });
        chrome.storage.sync.set({ "blockduration": data }, function () {
        });

        chrome.alarms.onAlarm.addListener(() => {
            block.blockIt = false;
        });
        this.timerId = setInterval(() => {
            this.timeNow = Date.now() / 1000;
            this.timeRemaining = this.alarmInfo.delayInMinutes * 60 - (this.timeNow - this.timeStart);
        }, 100);
    }

    stop() {
        block.blockIt = false;
        clearInterval(this.timerId);        
        chrome.alarms.clearAll();

        chrome.storage.sync.set({ "blockduration": 'stop' }, function () {
        });
    }
}

alarm = new Alarm();
alarm.alarm();

chrome.storage.sync.get("blockduration", function (storage) {
    if(storage.blockduration != 'stop' && storage.blockduration) {
        let data = JSON.parse(storage.blockduration);

        //alarm.start(data.duration - ((Date.now() - data.timestap) / 6000));
        alarm.start(data.duration);
        console.log(data);
    } else {
        console.log('blockduration stop');
    }
});