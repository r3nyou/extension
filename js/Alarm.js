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
                sendResponse('Hello from background.');
                block.blockIt = true;
                this.timeStart = Date.now() / 1000;
                chrome.alarms.create('anAlarm', this.alarmInfo);

                chrome.alarms.onAlarm.addListener(() => {
                    block.blockIt = false;
                });
                this.timerId = setInterval(() => {
                    this.timeNow = Date.now() / 1000;
                    this.timeRemaining = this.alarmInfo.delayInMinutes * 60 - (this.timeNow - this.timeStart);
                }, 100);
            }
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message == 'Bye') {
                sendResponse('Bye from background.');
                block.blockIt = false;
                clearInterval(this.timerId);
                
                chrome.alarms.clearAll();
            }
        });
    }

    start(duration) {
        this.alarmInfo.delayInMinutes = duration;

        block.blockIt = true;
        this.timeStart = Date.now() / 1000;
        chrome.alarms.create('anAlarm', this.alarmInfo);

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
    }
}

alarm = new Alarm();
alarm.alarm();