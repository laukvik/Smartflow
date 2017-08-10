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
  this.runAction = function(){
  }
}

function SendMailAction(){
  this.smartflow = {
    "path" : "/sent"
  };
  this.runAction = function(){
  }
}

function CancelComposeAction(){
  this.smartflow = {
    "path" : "/inbox"
  };
  this.runAction = function(){
  }
}

function LogoutAction(){
  this.smartflow = {
    "path" : "/"
  };
  this.runAction = function(){
  }
}



function ConfirmDeleteAction(){
  this.smartflow = {
    "path" : "/inbox",
    "state": "confirm",
    "value": true
  };
  this.runAction = function(){
  }
}

function YesAction(){
  this.smartflow = {
    "path" : "/inbox",
    "state": "confirm",
    "value": false
  };
  this.runAction = function(){
  }
}

function NoAction(){
  this.smartflow = {
    "path" : "/inbox",
    "state": "confirm",
    "value": undefined
  };
  this.runAction = function(){
  }
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
    //this.setEnabled("yesButton", false);
    //this.setEnabled("noButton", false);
  };
  this.viewDisabled = function(){
    console.info("viewDisabled");
    this.setEnabled("composeButton", false);
    this.setEnabled("confirmDeleteButton", false);
    this.setEnabled("logoutButton", false);
    this.setEnabled("yesButton", false);
    this.setEnabled("noButton", false);
  };
  this.actionPerformed = function(action){
    //console.info("actionPerformed", action);
  };
  this.stateChanged = function(state, value){

    if (state === "confirm") {
      console.info("confirm: ", value);
      var enabled = value === true;
      this.setEnabled("yesButton", enabled);
      this.setEnabled("noButton", enabled);
    } else {
      console.info("stateChanged: ", state, value);
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
