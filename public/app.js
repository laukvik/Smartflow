function StartAction() {
  this.smartflow = {
    "statess": {



      "checkboxes": [
        {"text": "Fish2", "value": "0"},
        {"text": "Eggs2", "value": "1"},
        {"text": "Milk", "value": "2"}
      ],
      "checkboxEnabled": false,
      "selectedCheckboxes": [
        "1",
      ],
      "checkboxRequired": false,
      "checkboxLabel": "Checkbox2",

      "radios": [
        {"text": "Big Mac2", "value": "bigMac", "group": "food"},
        {"text": "Whopper2", "value": "whopper", "group": "food"},
        {"text": "Coke2", "value": "coke", "group": "drink"},
        {"text": "Sprite2", "value": "sprite", "group": "drink"}
      ],
      "selectedRadio": "whopper",
      "radioEnabled": false,
      "radioRequired": false,
      "radioLabel": "Radio2",

      "pulldowns": [
        {"text": "Big Mac2", "value": "bigMac", "group": "food"},
        {"text": "Whopper2", "value": "whopper", "group": "food"},
        {"text": "Coke2", "value": "coke", "group": "drink"},
        {"text": "Sprite2", "value": "sprite", "group": "drink"}
      ],
      "pulldownEnabled": true,
      "selectedPulldown": "sprite",
      "pulldownRequired": false,
      "pulldownLabel": "Pulldown2",

      "textfield": "",
      "textfieldEnabled": true,
      "textfieldRequired": false,
      "textfieldLabel": "Textfield2",

      "button": "Button2",
      "buttonEnabled": false,




    }
  }
}

function FindMoviesAction() {
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

function FindTableAction() {
  this.smartflow = {
    "states": {
      "tableSelected": [
        "Uncertain", "Wilson", "Baby-bossen"
      ],
      "tableSorted": {
        "match": "title",
        "order": "asc"
      },
      "tableFilter": [
        {
          "match": "year",
          "type": "contains",
          "value": "201"
        }
      ],
      "tableColumns": [
        {
          "label": "Title",
          "key": "title"
        },
        {
          "label": "Genre",
          "key": "genres"
        },
        {
          "label": "Year",
          "key": "year"
        },
      ],
      "tableSelectable": true,

      "progress": 22,

    }
  };
}

function ShowDialogAction(){
  this.smartflow = {
    "states": {
      "dialogVisible": true
    }
  }
}

function CloseDialogAction(){
  this.smartflow = {
    "states": {
      "dialogVisible": false
    }
  }
}

class InboxView {
  constructor() {
    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": "Layout",
          "components": [
            {
              "type": "Tabs",
              "selectedIndex": 1,
              "tabs": [
                {
                  "label": "Minimum",
                  "components": [
                    {
                      "type": "Checkbox",
                      "label": "Checkbox",
                      "required": true,
                      "states": {
                        "options": "checkboxes",
                        "selected": "selectedCheckboxes",
                        "enabled": "checkboxEnabled",
                        "required": "checkboxRequired",
                        "label": "checkboxLabel"
                      },
                      "optionsState": "checkboxes",
                      "selected": [
                        "0", "2"
                      ],
                      "options": [
                        {"text": "Fish", "value": "0"},
                        {"text": "Eggs", "value": "1"},
                        {"text": "Milk", "value": "2"}
                      ],
                      "col-md": "6",
                      "col-lg": "4"
                    },
                    {
                      "type": "Radio",
                      "label": "Radio",
                      "required": true,
                      "vertical": "false",
                      "selected": "1",
                      "states": {
                        "options": "radios",
                        "selected": "selectedRadio",
                        "enabled": "radioEnabled",
                        "required": "radioRequired",
                        "label": "radioLabel"
                      },
                      "options": [
                        {"text": "Fish", "value": "0"},
                        {"text": "Eggs", "value": "1"},
                        {"text": "Milk", "value": "2"}
                      ],
                      "col-md": "6",
                      "col-lg": "4"
                    },
                    {
                      "type": "Pulldown",
                      "label": "Pulldown",
                      "required": true,
                      "selected": "coke",
                      "enabled": true,
                      "options": [
                        {"text": "Big Mac", "value": "bigMac", "group": "food"},
                        {"text": "Whopper", "value": "whopper", "group": "food"},
                        {"text": "Coke", "value": "coke", "group": "drink"},
                        {"text": "Sprite", "value": "sprite", "group": "drink"}
                      ],
                      "states": {
                        "options": "pulldowns",
                        "selected": "selectedPulldown",
                        "enabled": "pulldownEnabled",
                        "required": "pulldownRequired",
                        "label": "pulldownLabel"
                      },
                      "col-md": "6",
                      "col-lg": "4"
                    }
                    ,
                    {
                      "type": "Textfield",
                      "label": "Textfield",
                      "required": true,
                      "value": "",
                      "placeholder": "Placeholder here...",
                      "validation": {
                        "pattern": "hh:mm:ss",
                        "regex": "^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$",
                        "message": "Please enter valid hour"
                      },
                      "icon_before": "glyphicon-time",
                      "icon_after": "glyphicon-calendar",
                      "states": {
                        "enabled": "textfieldEnabled",
                        "value": "textfield",
                        "required": "textfieldRequired",
                        "label": "textfieldLabel"
                      },
                      "col-md": "6",
                      "col-lg": "12"
                    },
                    {
                      "type": "Textfield",
                      "label": "Textarea",
                      "required": true,
                      "rows": 10,
                      "placeholder": "Placeholder here...",
                      "col-md": "12"
                    },
                    {
                      "type": "Button",
                      "label": "Button",
                      "enabled": true,
                      "states": {
                        "enabled": "buttonEnabled",
                        "value": "button"
                      },
                      "action": "FindMoviesAction",
                      "col-md": "12"
                    }
                  ]
                },
                {
                  "label": "Core",
                  "components": [
                    {
                      "type": "Dialog",
                      "label": "HelloDialog",
                      "visible": false,
                      "title": "Dialog",
                      "states": {
                        "visible": "dialogVisible"
                      },
                      "components": [
                        {
                          "type": "Textfield",
                          "value": "",
                          "label": "Number",
                          "required": true,
                        }
                      ],
                      "actions": [
                        {
                          "type": "Button",
                          "label": "Ok",
                          "validate": true,
                          "action": "CloseDialogAction"
                        },
                        {
                          "type": "Button",
                          "label": "Cancel",
                          "action": "CloseDialogAction"
                        }
                      ]
                    },
                    {
                      "type": "Toolbar",
                      "actions": [
                        {
                          "type": "Button",
                          "label": "Open dialog",
                          "action": "ShowDialogAction"
                        }
                      ]
                    },
                    {
                      "type": "Progress",
                      "value": "0",
                      "states": {
                        "value": "progress"
                      }
                    },
                    {
                      "type": "Table",
                      "id": "inboxTable",
                      "class": "table table-striped",
                      "rowKey": "title",
                      "selectable": "false",
                      "col-md": "12",
                      "col-lg": "12",
                      "states": {
                        "rows" : "movies",
                        "selected": "tableSelected",
                        "columns": "tableColumns",
                        "sort": "tableSort",
                        "filter": "tableFilter",
                        "paging": "tablePaging",
                        "selectable": "tableSelectable"
                      },
                      "sort": {
                        "match": "year",
                        "order": "asc"
                      },
                      "filter": [
                        {
                          "match": "genres",
                          "type": "contains",
                          "value": "comedy"
                        }
                      ],
                      "paging": {
                        "size": 10,
                        "page": 0,
                      },
                      "columns": [
                        {
                          "label": "Year",
                          "key": "year"
                        },
                        {
                          "label": "Title",
                          "key": "title"
                        },
                        {
                          "label": "Genre",
                          "key": "genres"
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "Advanced",
                  "components": []
                }
              ]
            }
          ]
        }
      ],
      "components2": [
        {
          "type": "Card",
          "title": "Smartflow",
          "subtitle": "Application flow API for JavaScript",
          "components": [
            {
              "type": "GridList",
              "state": "movies",
              "tooltip": "storyline",
              "url": "poster",
              "base": "https://images-na.ssl-images-amazon.com/images/M/",
              "sort": {
                "match": "year",
                "order": "asc"
              },
              "filter": [
                {
                  "match": "genres",
                  "type": "contains",
                  "value": "war"
                }
              ],
              "paging": {
                "size": 10,
                "page": 0,
              },
            },
            {
              "type": "Grid",
              "hidden": "true",
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
            }
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

  viewInitialized(formatter) {
  };

  viewEnabled() {
    this.runSmartflow(new StartAction());
    this.runSmartflow(new FindMoviesAction());
    this.runSmartflow(new FindTableAction());
  };

  viewDisabled() {
  };

  stateChanged(state, value) {
  };

  actionPerformed(evt) {
    //console.info("InboxView.actionPerformed: ", evt);
  };

  componentChanged(evt) {
    console.info("InboxView.componentChanged: ", evt);
  }
}


var config = {
  "LoginAction": "/api/login",
  "DeleteAction": "/api/delete"
};

var langNO = {
  "welcome": "Velkommen til {0}",
  "confirmdelete": "Er du sikker på at du vil slette?",
  "deleted": "Slettet."
};
var langEN = {
  "welcome": "Welcome til {0}",
  "confirmdelete": "Are you sure you want to delete?",
  "deleted": "Deleted."
};


var app = new Smartflow();
app.setConfig(config);
app.loadLanguage("no", langNO);
app.loadLanguage("en", langEN);
app.setDefaultLocale("en");
app.addView(new InboxView());
app.start();



