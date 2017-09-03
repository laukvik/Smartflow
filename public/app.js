function SelectAllAction(){
  this.smartflow = {
    "components": [
      {
        "id": "inboxTable",
        "selectedIndexes": [ 0, 2 ]
      }
    ]
  }
}


function ClearEmailsAction(){
  this.smartflow = {
    "states": {
      "emails": [
      ]
    }
  }
}

function AddEmailAction(){
  this.smartflow = {
    "addStates": {
      "emails": [
        {
          "id": "4",
          "email": "test@test4.com",
          "subject": "Hello world",
          "date": new Date()
        },
      ]
    }
  }
}

function FindEmailsAction(){
  this.smartflow = {
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

function FindMoviesAction(){
  this.smartflow = {
    "request": {
      "url": "movies.json",
      "method": "get",
      "type": "json"
    },
    "success": {
      "path": "/",
      "state": "movies"
    },
    "error": {
      "path": "/",
      "state": "moviesFailed"
    }
  };
}

function FindMovies2Action(){
  this.smartflow = {
    "request": {
      "url": "movies2.json",
      "method": "get",
      "type": "json"
    },
    "success": {
      "path": "/",
      "state": "movies"
    },
    "error": {
      "path": "/",
      "state": "moviesFailed"
    }
  };
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
              "type": "GridList",
              "state": "movies",
              "url": "poster",
              "base": "https://images-na.ssl-images-amazon.com/images/M/"
            },
            {
              "type": "Grid",
              "components": [
                {
                  "type": "Label",
                  "label": "Lorem ipsum dolor sit amet, ex eum veri alterum. Idque latine expetenda sea ad, purto novum evertitur sea ad, in purto possit iracundia quo."
                },
                {
                  "type": "Label",
                  "label": "Nec atqui oporteat scriptorem ne, est ex odio viderer nostrum. Sea agam graece possit id, ne quando nostro nusquam vis."
                },
                {
                  "type": "Label",
                  "label": "Purto consulatu sea no, ne nam tota verterem explicari, harum invidunt abhorreant ea cum. Ne vel viris labitur reprimique, et sit debet definiebas vituperata, vero quando deserunt mei at."
                }
              ]
            },
            {
              "type": "Table",
              "id": "inboxTable",
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
                  "format" : "DD.MM.YYYY hh:mm:ss"
                }
              ],
              "state": "emails"
            },
          ],
          "actions": [
            {
              "type": "Button",
              "label": "Find",
              "action": "FindEmailsAction"
            },
            {
              "type": "Button",
              "label": "Clear",
              "action": "ClearEmailsAction"
            },
            {
              "type": "Button",
              "label": "Add",
              "action": "AddEmailAction"
            },
            {
              "type": "Button",
              "label": "Select All",
              "action": "SelectAllAction"
            },
            {
              "type": "Button",
              "label": "Select None",
              "action": "SelectNoneAction"
            },
            {
              "type": "Button",
              "label": "Movies",
              "action": "FindMoviesAction"
            },
            {
              "type": "Button",
              "label": "Movies2",
              "action": "FindMovies2Action"
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
  };
  componentChanged(evt){
    console.info("componentChanged: ", evt);
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



