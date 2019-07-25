/*
var source = new EventSource("http://localhost/extension_backend/sse.php"); 


source.onmessage = function (event) {
    var data = event.data;
    var origin = event.origin;
    var lastEventId = event.lastEventId;
    
    console.log(data);
    console.log(origin);
    console.log(lastEventId);
};


source.addEventListener('myEvent', function(event) {
    var data = event.data;
    var origin = event.origin;
    var lastEventId = event.lastEventId;

    console.log(data);
    console.log(origin);
    console.log(lastEventId);

}, false);
*/