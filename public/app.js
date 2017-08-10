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


function buildDemo1(arr){
  var html = "";
  for (var x=0; x<arr.length; x++){
    html += '<div id="'+ arr[x] +'" class="request">&nbsp;</div>';
  }
  document.getElementById("demoPanel").innerHTML = html;
}

function runDemo1(){
  var arr = [ "reqLogin", "reqCategories", "reqAddressbook", "reqQuote" ];

  buildDemo1(arr);

  var actionWithRequests = new SmartflowAction();
  actionWithRequests.addRequest( reqLogin );
  actionWithRequests.addRequest( reqCategories );
  actionWithRequests.addRequest( reqAddressbook );
  actionWithRequests.addRequest( reqQuote );


  function HelloWorldAction() {
    this.runAction = function() {
    };
  }

  function Main(){
    this.actionFailed = function(){

    }
  }

  var actionSimple = new HelloWorldAction();

  var app = new SmartflowApplication();
  app.startAction( actionWithRequests );
  app.startAction( actionSimple );

}

//----------------


function LoginAction() {
  this.smartflow = {
    "state": "time",
    "request": {
      "url": "/api/time",
      "method": "get"
    },
    "success" : "InboxController",
    "error": "LoginController"
  };
}

function ValidateAction(){
  this.smartflow = {
    "state": "formValidated",
    "view" : "LoginController"
  };
  this.runAction = function(){
    this.smartflow.value = true;
  }
}

function MainController(){
  this.viewInitialized = function(){
    console.info("MainController.viewInitialized");
    this.runAction( new LoginAction() );
  };
  this.viewEnabled = function(){
    console.info("MainController.viewEnabled");
  };
  this.actionPerformed = function(action){
    console.info("MainController.actionPerformed: ", action);
  }
}

function LoginController(){
  this.viewInitialized = function(){
    console.info("LoginController.viewInitialized");
  };
  this.viewEnabled = function(){
    console.info("LoginController.viewEnabled");
  };
  this.actionPerformed = function(action){
    console.info("LoginController.actionPerformed: ", action);
  }
}

function InboxController(){
  this.viewInitialized = function(){
    console.info("InboxController.viewInitialized");
  };
  this.viewEnabled = function(){
    console.info("InboxController.viewEnabled");
  };
  this.actionPerformed = function(action){
    console.info("InboxController.actionPerformed: ", action);
  }
}

function runDemo2(){
  var app = new Smartflow();
  app.addController(new MainController());
  app.addController(new LoginController());
  //app.addController(new InboxController());
  //app.runAction(new LoginAction());
  //app.runAction(new ValidateAction());
  app.start();
}
