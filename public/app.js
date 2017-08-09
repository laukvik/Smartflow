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
function App(){
  this.addController = function(ctrl){

  };
  this.runAction = function(action){
    if (action.smartflow) {
      //console.info("App: starting ", action);
      if (action.smartflow.request) {
        // Run with request
        //console.info("App: will start request");
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4){
            var statusCode = parseInt(this.status);
            if (statusCode == 200) {
              action.smartflow.value = this.response;
              action.smartflow.view = action.smartflow.success;
              self.stateChanged(action.smartflow.state, action.smartflow.value);
              self.viewChanged(action.smartflow.view);
            } else {
              action.smartflow.value = undefined;
              action.smartflow.view = action.smartflow.error;
              self.viewChanged(action.smartflow.view);
            }
          }
        };
        xhr.open( 'GET', action.smartflow.request.url, true  );
        xhr.send();

      } else {
        // Run without request
        action.runAction();
        this.stateChanged(action.smartflow.state, action.smartflow.value);
        this.viewChanged(action.smartflow.view);
      }
    } else {
      console.error("App: invalid action ", action);
    }
  };
  this.stateChanged = function(state, value){
    console.info("State changed: ", state, value);
  };
  this.viewChanged = function(view){
    console.info("View changed: ", view);
  };
  this.setView = function(view){

  };
}


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

function LoginController(){
  this.viewEnabled = function(){

  }
}

function InboxController(){
  this.viewEnabled = function(){

  }
}

function runDemo2(){
  var app = new App();
  app.addController(new LoginController());
  app.addController(new InboxController());
  app.setView("LoginController");
  app.runAction(new LoginAction());
  app.runAction(new ValidateAction());
}
