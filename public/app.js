function LoginAction() {
  this.smartflow = {
    "request": {
      "url": "/api/login",
      "method": "get"
    },
    "success": {
      "path": "/inbox",
      "state": "user"
    },
    "error": {
      "path": "/",
      "state": "loginFailed"
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

function LoginDialogAction(){
  this.smartflow = {
    "path": "/",
    "dialog": {
      "title": "Bekreft sletting",
      "body": "Er du sikker på at du vil slette?",
      "state": "dialogConfirm",
      "buttons": [
        {
          "label": "Ja",
          "path": "/",
          "value": "yes"
        },
        {
          "label": "Nei",
          "path": "/inbox",
          "value": "no"
        }
      ]
    }
  };
}

class LoginView {
  constructor(){
    this.smartflow = {
      "path" : "/",
      "components": [
        {
          "type": "card",
          "title": "Smartflow",
          "subtitle": "v1b",
          "text": "Heloe text",
          "components": [
            {
              "type": "label",
              "label": "Sub component"
            },
          ]
        },
        {
          "type": "label",
          "label": "LoginView",
          "class": "info",
          "id": "loginInfoMessage"
        },

        {
          "type": "button",
          "label": "LoginAction",
          "action": "LoginDialogAction",
          "id": "loginButton"
        },
        {
          "type": "button",
          "label": "CloseLoginFailedAction",
          "action": "CloseLoginFailedAction",
          "id": "loginFailedButton"
        },
        {
          "type": "label",
          "label": "",
          "class": "error",
          "id": "loginErrorMessage"
        }
      ]
    };
  }

  setEnabled(id, isEnabled){
    if (isEnabled){
      document.getElementById(id).removeAttribute("disabled");
    } else {
      document.getElementById(id).setAttribute("disabled", "true");
    }
  };
  viewInitialized(lang){
    var self = this;
    // document.getElementById("loginButton").addEventListener("click", function(){
    //   self.runSmartflow(new LoginDialogAction());
    // });
    document.getElementById("loginFailedButton").addEventListener("click", function(){
      self.runSmartflow(new CloseLoginFailedAction());
    });
    document.getElementById("loginInfoMessage").innerText = lang.format("welcome", ["Smartflow", 1, 2]);
  };
  viewEnabled(){
    this.setEnabled("loginButton", true);
  };
  viewDisabled(){
    this.setEnabled("loginButton", false);
  };
  stateChanged(state, value){
    if (state === "loginFailed") {
      this.setEnabled("loginFailedButton", value !== undefined);
      document.getElementById("loginErrorMessage").innerText = value !== undefined ? value : "";
    }
    this.setEnabled("loginButton", value === undefined);
  };
  actionPerformed(action){
    console.info("actionPerformed", action);
  };
  componentChanged(evt){
    console.info("componentChanged", evt);
  }
}



class InboxView{
  constructor(){
    this.smartflow = {
      "path" : "/inbox",
      "components": [
        {
          "type": "table",
          "columns": [
            {
              "label": "",
            },
            {
              "label": "From"
            },
            {
              "label": "Subject"
            }
          ]
        },
        {
          "type": "button",
          "label": "ComposeMailAction",
          "action": "ComposeMailAction",
          "id": "composeButton"
        },
        {
          "type": "button",
          "label": "ConfirmDeleteAction",
          "action": "ConfirmDeleteAction",
          "id": "confirmDeleteButton"
        },
        {
          "type": "button",
          "label": "LogoutAction",
          "action": "LogoutAction",
          "id": "logoutButton"
        },
      ]
    };
  }

  setEnabled(id, isEnabled){
    if (isEnabled){
      document.getElementById(id).removeAttribute("disabled");
    } else {
      document.getElementById(id).setAttribute("disabled", "true");
    }
  };
  viewInitialized(lang){
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
  viewEnabled(){
    this.setEnabled("composeButton", true);
    this.setEnabled("confirmDeleteButton", true);
    this.setEnabled("logoutButton", true);
  };
  viewDisabled(){
    this.setEnabled("composeButton", false);
    this.setEnabled("confirmDeleteButton", false);
    this.setEnabled("logoutButton", false);
  };
  actionPerformed(action){
    console.info("actionPerformed", action);
  };
  stateChanged(state, value){
    if (state === "confirm") {
      var enabled = value === true;
      this.setEnabled("yesButton", enabled);
      this.setEnabled("noButton", enabled);
      if (value === undefined || value === true) {
        this.setEnabled("composeButton", false);
        this.setEnabled("confirmDeleteButton", false);
        this.setEnabled("logoutButton", false);
      }
      document.getElementById("confirmDeleteMessage").innerText = enabled ? this.lang.format("confirmdelete") : "";
    }
    if (state === "delete") {
      if (value === undefined) {
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


class ComposeView {
  constructor(){
    this.smartflow = {
      "path" : "/compose",
      "components": [
        {
          "type": "textfield",
          "label": "To",
          "value": "Morten",
          "placeholder": "email"
        },
        {
          "type": "textfield",
          "label": "Body",
          "value": "Morten",
          "placeholder": "Message"
        },
        {
          "type": "button",
          "label": "SendMailAction",
          "action": "SendMailAction",
          "id": "sendMailButton"
        },
        {
          "type": "button",
          "label": "CancelComposeAction",
          "action": "CancelComposeAction",
          "id": "cancelMailButton"
        },
        {
          "type": "button",
          "label": "CloseSentAction",
          "action": "CloseSentAction",
          "id": "closeSentButton"
        }
      ]
    };
  }

  setEnabled(id, isEnabled){
    if (isEnabled){
      document.getElementById(id).removeAttribute("disabled");
    } else {
      document.getElementById(id).setAttribute("disabled", "true");
    }
  };
  viewInitialized(formatter){
    // var self = this;
    // document.getElementById("sendMailButton").addEventListener("click", function(){
    //   self.runSmartflow(new SendMailAction());
    // })
    // document.getElementById("cancelMailButton").addEventListener("click", function(){
    //   self.runSmartflow(new CancelComposeAction());
    // })
    // document.getElementById("closeSentButton").addEventListener("click", function(){
    //   self.runSmartflow(new CloseSentAction());
    //})
  };
  viewEnabled(){
    this.setEnabled("sendMailButton", true);
    this.setEnabled("cancelMailButton", true);
    this.setEnabled("closeSentButton", false);
  };
  viewDisabled(){
    this.setEnabled("sendMailButton", false);
    this.setEnabled("cancelMailButton", false);
    this.setEnabled("closeSentButton", false);
  };
  actionPerformed(action){
    console.info("actionPerformed", action);
  };
  stateChanged(state, value){
    if (state === "receipt") {
      var enabled = value === true;
      this.setEnabled("closeSentButton", enabled);
      this.setEnabled("sendMailButton", !enabled);
      this.setEnabled("cancelMailButton", !enabled);
    }
  };
}



var config = {
  "LoginAction": "/api/login",
  "DeleteAction": "/api/delete"
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
app.start();
