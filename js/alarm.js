class Alarm {

    constructor() {
        this.alarmInfo = {
            delayInMinutes: 1, 
        };
    }

    alarm() {
        var ala = this.alarmInfo;
        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
            if(message == 'Hello'){
                sendResponse('Hello from background.');
                block.blockIt = true;

                chrome.alarms.create('anAlarm', ala);

                chrome.alarms.onAlarm.addListener(function() {
                    block.blockIt = false;
                });
            }
        });
    }
}

alarm = new Alarm();
alarm.alarm();