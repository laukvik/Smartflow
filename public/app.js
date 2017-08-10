function LoginAction() {
  this.smartflow = {
    "state": "time",
    "request": {
      "url": "/api/login",
      "method": "get"
    },
    "success" : "/inbox",
    "error": "/login"
  };
}

function ComposeAction(){
  this.smartflow = {
    "path" : "/compose"
  };
}

function SendMailAction(){
  this.smartflow = {
    "path" : "/sent"
  };
}

function CancelComposeAction(){
  this.smartflow = {
    "path" : "/inbox"
  };
}

function LogoutAction(){
  this.smartflow = {
    "path" : "/"
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
      "confirm" : false,
      "delete": true
    }
  };
}

function NoAction(){
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "confirm" : false,
      "delete": false
    }
  };
}





function LoginController(){
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
  this.viewInitialized = function(){
    var self = this;
    document.getElementById("loginButton").addEventListener("click", function(){
      self.runAction(new LoginAction());
    })
  };
  this.viewEnabled = function(){
    this.setEnabled("loginButton", true);
  };
  this.viewDisabled = function(){
    this.setEnabled("loginButton", false);
  };
  this.actionPerformed = function(action){
    console.info("actionPerformed", action);
  }
}

function InboxController(){
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
  this.viewInitialized = function(){
    var self = this;
    document.getElementById("composeButton").addEventListener("click", function(){
      self.runAction(new ComposeAction());
    })
    document.getElementById("logoutButton").addEventListener("click", function(){
      self.runAction(new LogoutAction());
    })
    document.getElementById("confirmDeleteButton").addEventListener("click", function(){
      self.runAction(new ConfirmDeleteAction());
    })

    document.getElementById("yesButton").addEventListener("click", function(){
      self.runAction(new YesAction());
    })
    document.getElementById("noButton").addEventListener("click", function(){
      self.runAction(new NoAction());
    })
  };
  this.viewEnabled = function(){
    this.setEnabled("composeButton", true);
    this.setEnabled("confirmDeleteButton", true);
    this.setEnabled("logoutButton", true);
  };
  this.viewDisabled = function(){
    console.info("viewDisabled");
    this.setEnabled("composeButton", false);
    this.setEnabled("confirmDeleteButton", false);
    this.setEnabled("logoutButton", false);
  };
  this.actionPerformed = function(action){
    //console.info("actionPerformed", action);
  };
  this.stateChanged = function(state, value){
    console.info("stateChanged: ", state, value);

    if (state === "confirm") {
      var enabled = value === true;
      this.setEnabled("yesButton", enabled);
      this.setEnabled("noButton", enabled);
      this.setEnabled("composeButton", !enabled);
      this.setEnabled("confirmDeleteButton", !enabled);
      this.setEnabled("logoutButton", !enabled);
    }
  }
}


function ComposeController(){
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
  this.viewInitialized = function(){
    var self = this;
    document.getElementById("sendMailButton").addEventListener("click", function(){
      self.runAction(new SendMailAction());
    })
    document.getElementById("cancelMailButton").addEventListener("click", function(){
      self.runAction(new CancelComposeAction());
    })
  };
  this.viewEnabled = function(){
    this.setEnabled("sendMailButton", true);
    this.setEnabled("cancelMailButton", true);
  };
  this.viewDisabled = function(){
    this.setEnabled("sendMailButton", false);
    this.setEnabled("cancelMailButton", false);
  };
  this.actionPerformed = function(action){
    console.info("actionPerformed", action);
  }
}




  var app = new Smartflow();
  app.addController(new LoginController());
  app.addController(new InboxController());
  app.addController(new ComposeController());
  app.start();
