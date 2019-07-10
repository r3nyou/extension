// chrome.runtime.sendMessage('Hello', function(response){
//   document.getElementById('mes').innerHTML = response;
// });

var btn1Obj = document.getElementById("btn_start"); 
btn1Obj.addEventListener("click",function(){
  chrome.runtime.sendMessage('Hello', function(response){
    document.getElementById('mes').innerHTML = response;
  });
},false); 
