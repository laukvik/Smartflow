function fix(id, isSuccess){
  document.getElementById(id).className = "request " + (isSuccess == null ? "" : (isSuccess ? "success" : "failed"));
  document.getElementById(id).innerText = id;
}


var reqLogin = new SmartflowRequest('/api/login');
reqLogin.onSuccess = function(){
  fix("reqLogin", true);
};
reqLogin.onError = function(){
  fix("reqLogin", false);
};
var reqCategories = new SmartflowRequest('/api/categories');
reqCategories.onSuccess = function(){
  fix("reqCategories", true);
};
reqCategories.onError = function(){
  fix("reqCategories", false);
};
var reqAddressbook = new SmartflowRequest('/api/addressbook');
reqAddressbook.onSuccess = function(){
  fix("reqAddressbook", true);
};
reqAddressbook.onError = function(){
  fix("reqAddressbook", false);
};
var reqQuote = new SmartflowRequest('/api/quote');
reqQuote.onSuccess = function(){
  fix("reqQuote", true);
};
reqQuote.onError = function(){
  fix("reqQuote", false);
};


function buildDemo(arr){
  var html = "";
  for (var x=0; x<arr.length; x++){
    html += '<div id="'+ arr[x] +'" class="request">&nbsp;</div>';
  }
  document.getElementById("demoPanel").innerHTML = html;
}

function runDemo(){
  var arr = [ "reqLogin", "reqCategories", "reqAddressbook", "reqQuote" ];

  buildDemo(arr);

  var actionWithRequests = new SmartflowAction();
  actionWithRequests.addRequest( reqLogin );
  actionWithRequests.addRequest( reqCategories );
  actionWithRequests.addRequest( reqAddressbook );
  actionWithRequests.addRequest( reqQuote );


  function HelloWorldAction() {
    this.runAction = function() {
    };
  }

  var actionSimple = new HelloWorldAction();

  var app = new SmartflowApplication();
  app.startAction( actionWithRequests );
  app.startAction( actionSimple );

}
