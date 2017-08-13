function LoginAction() {
  this.smartflow = {
    "state": "user",
    "path": "/inbox",
    "request": {
      "url": "/api/login",
      "method": "get"
    },
    "error": {
      "path": "/",
      "state": "loginFailed"
    }
  };
}

function ValidateLoginAction(){
  this.smartflow = {
    "path" : "/",
    "states": {
      "loginRequiredFields": undefined
    }
  };
}

function CloseLoginFailedAction(){
  this.smartflow = {
    "path" : "/",
    "states": {
      "loginFailed": undefined
    }
  };
}

function ComposeAction(){
  this.smartflow = {
    "path" : "/compose"
  };
}

function SendMailAction(){
  this.smartflow = {
    "path" : "/compose",
    "states": {
      "receipt": true
    }
  };
}

function CancelComposeAction(){
  this.smartflow = {
    "path" : "/inbox"
  };
}

function LogoutAction(){
  this.smartflow = {
    "path" : "/",
    "states": {
      "user": undefined
    }
  };
}



function ConfirmDeleteAction(){
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "confirm" : true
    }
  };
}

function YesAction(){
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "confirm" : undefined,
      "delete": true
    }
  };
}

function NoAction(){
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "confirm" : undefined,
      "delete": undefined
    }
  };
}

function CloseSentAction(){
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "receipt": undefined
    }
  };
}

function CloseDeletedAction(){
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "delete": undefined
    }
  };
}


function LoginView(){
  this.smartflow = {
    "path" : "/"
  };
  this.setEnabled = function(id, isEnabled){
    if (isEnabled){
      document.getElementById(id).removeAttribute("disabled");
    } else {
      document.getElementById(id).setAttribute("disabled", "true");
    }
  };
  this.viewInitialized = function(lang){
    var self = this;
    document.getElementById("loginButton").addEventListener("click", function(){
      self.runSmartflow(new LoginAction());
    })
    document.getElementById("loginFailedButton").addEventListener("click", function(){
      self.runSmartflow(new CloseLoginFailedAction());
    })
    document.getElementById("loginInfoMessage").innerText = lang.format("welcome", ["Smartflow", 1, 2]);
  };
  this.viewEnabled = function(){
    this.setEnabled("loginButton", true);
  };
  this.viewDisabled = function(){
    this.setEnabled("loginButton", false);
  };
  this.stateChanged = function(state, value){
    if (state == "loginFailed") {
      this.setEnabled("loginFailedButton", value != undefined);
      document.getElementById("loginErrorMessage").innerText = value != undefined ? value : "";
    }
    this.setEnabled("loginButton", value == undefined);
  };
  this.actionPerformed = function(action){
    console.info("actionPerformed", action);
  }
}

function InboxView(){
  this.smartflow = {
    "path" : "/inbox"
  };
  this.setEnabled = function(id, isEnabled){
    if (isEnabled){
      document.getElementById(id).removeAttribute("disabled");
    } else {
      document.getElementById(id).setAttribute("disabled", "true");
    }
  };
  this.viewInitialized = function(lang){
    this.lang = lang;
    var self = this;
    document.getElementById("composeButton").addEventListener("click", function(){
      self.runSmartflow(new ComposeAction());
    })
    document.getElementById("logoutButton").addEventListener("click", function(){
      self.runSmartflow(new LogoutAction());
    })
    document.getElementById("confirmDeleteButton").addEventListener("click", function(){
      self.runSmartflow(new ConfirmDeleteAction());
    })

    document.getElementById("yesButton").addEventListener("click", function(){
      self.runSmartflow(new YesAction());
    })
    document.getElementById("noButton").addEventListener("click", function(){
      self.runSmartflow(new NoAction());
    })

    document.getElementById("closeDeletedButton").addEventListener("click", function(){
      self.runSmartflow(new CloseDeletedAction());
    });
  };
  this.viewEnabled = function(){
    this.setEnabled("composeButton", true);
    this.setEnabled("confirmDeleteButton", true);
    this.setEnabled("logoutButton", true);
  };
  this.viewDisabled = function(){
    this.setEnabled("composeButton", false);
    this.setEnabled("confirmDeleteButton", false);
    this.setEnabled("logoutButton", false);
  };
  this.actionPerformed = function(action){
    console.info("actionPerformed", action);
  };
  this.stateChanged = function(state, value){
    if (state === "confirm") {
      var enabled = value === true;
      this.setEnabled("yesButton", enabled);
      this.setEnabled("noButton", enabled);
      if (value == undefined || value == true) {
        this.setEnabled("composeButton", false);
        this.setEnabled("confirmDeleteButton", false);
        this.setEnabled("logoutButton", false);
      }
      document.getElementById("confirmDeleteMessage").innerText = enabled ? this.lang.format("confirmdelete") : "";
    }
    if (state === "delete") {
      if (value == undefined) {
        this.setEnabled("composeButton", true);
        this.setEnabled("confirmDeleteButton", true);
        this.setEnabled("logoutButton", true);
        this.setEnabled("closeDeletedButton", false);
      } else {
        this.setEnabled("closeDeletedButton", value === true);
      }
    }
  }
}


function ComposeView(){
  this.smartflow = {
    "path" : "/compose"
  };
  this.setEnabled = function(id, isEnabled){
    if (isEnabled){
      document.getElementById(id).removeAttribute("disabled");
    } else {
      document.getElementById(id).setAttribute("disabled", "true");
    }
  };
  this.viewInitialized = function(lang){
    var self = this;
    document.getElementById("sendMailButton").addEventListener("click", function(){
      self.runSmartflow(new SendMailAction());
    })
    document.getElementById("cancelMailButton").addEventListener("click", function(){
      self.runSmartflow(new CancelComposeAction());
    })
    document.getElementById("closeSentButton").addEventListener("click", function(){
      self.runSmartflow(new CloseSentAction());
    })
  };
  this.viewEnabled = function(){
    this.setEnabled("sendMailButton", true);
    this.setEnabled("cancelMailButton", true);
    this.setEnabled("closeSentButton", false);
  };
  this.viewDisabled = function(){
    this.setEnabled("sendMailButton", false);
    this.setEnabled("cancelMailButton", false);
    this.setEnabled("closeSentButton", false);
  };
  this.actionPerformed = function(action){
    console.info("actionPerformed", action);
  };
  this.stateChanged = function(state, value){
    if (state === "receipt") {
      var enabled = value === true;
      this.setEnabled("closeSentButton", enabled);
      this.setEnabled("sendMailButton", !enabled);
      this.setEnabled("cancelMailButton", !enabled);
    }
  };
}


function ToolbarView(){
  this.smartflow = {
  };
  this.viewInitialized = function(lang){

  };
  this.viewEnabled = function(){
  };
  this.viewDisabled = function(){
  };
  this.actionPerformed = function(action){
    console.info("actionPerformed", action);
  };
  this.stateChanged = function(state, value){

  };
}

var config = {
  "LoginAction": "/api/login"
};

var langNO = {
  "welcome": "Velkommen til {0}",
  "confirmdelete": "Er du sikker på at du vil slette?",
  "deleted" : "Slettet."
};
var langEN = {
  "welcome": "Welcome til {0}",
  "confirmdelete": "Are you sure you want to delete?",
  "deleted" : "Deleted."
};


var app = new Smartflow();
app.setConfig(config);
app.loadLanguage("no", langNO);
app.loadLanguage("en", langEN);
app.setDefaultLocale("en");
app.addView(new LoginView());
app.addView(new InboxView());
app.addView(new ComposeView());
//app.addView(new ToolbarView());
app.start();
