function FindEmailsAction(){
  this.smartflow = {
    "path" : "/",
    "states": {
      "emails": [
        {
          "id": "1",
          "email": "test@test1.com",
          "subject": "Hello world",
          "date": new Date()
        },
        {
          "id": "2",
          "email": "test@test2.com",
          "subject": "Hello world2",
          "date": new Date()
        },
        {
          "id": "3",
          "email": "test@test3.com",
          "subject": "Hello world3",
          "date": new Date()
        }
      ]
    },
  }
}


class InboxView {
  constructor(){
    this.smartflow = {
      "path" : "/",
      "components": [
        {
          "type": "Card",
          "title": "Smartflow",
          "subtitle": "Application flow API for JavaScript",
          "components": [
            {
              "type": "Table",
              "rowId": "id",
              "selectable": true,
              "columns": [
                {
                  "label": "From",
                  "key" : "email"
                },
                {
                  "label": "Subject",
                  "key" : "subject"
                },
                {
                  "label": "Date",
                  "key" : "date",
                  "format" : "DD.MM.YYYY"
                }
              ],
              "rows": []
            },
          ],
          "actions": [
            {
              "type": "Button",
              "label": "Find emails",
              "action": "FindEmailsAction"
            }
          ]
        }
        ],
      "originals": [
        {
          "type": "Dialog",
          "title": "Vil du",
          "actions": [
            {
              "type": "Button",
              "label": "Ok",
              "action": "LoginDialogAction",
              "id": "loginButton"
            }
          ]
        },
        {
          "type": "textfield",
          "label": "To",
          "value": "Morten",
          "placeholder": "email"
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
  viewInitialized(formatter){
  };
  viewEnabled(){
  };
  viewDisabled(){
  };
  stateChanged(state, value){
  };
  actionPerformed(action){
    console.info("actionPerformed", action);
  };
  componentChanged(evt){
    console.info("componentChanged", evt);
  }
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
app.addView(new InboxView());
app.start();
