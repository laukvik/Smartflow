import {View} from "../../../src/View";
import {FindMoviesAction} from "../actions/MoviesAction";
import {FindGlobalMovies} from "../actions/FindGlobalMovies";
import {SearchfieldAction} from "../actions/SearchfieldAction";
import {ShowDialogAction} from "../actions/ShowDialogAction";
import {StartAction} from "../actions/StartAction";
import {CloseDialogAction} from "../actions/CloseDialogAction";
import {FindTableAction} from "../actions/FindTableAction";
import {FindPostersAction} from "../actions/FindPostersAction";

export class InboxView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": "Tabs",
          "selectedIndex": 2,
          "tabs": [
            {
              "label": "Comedy",
              "components": [
                {
                  "type": "Card",
                  "title": "Card title",
                  "src": "sunset.jpg",
                  "visible": true,
                  "description": "Some quick example text to build on the card title and make up the bulk of the card's content.",
                  "button": "Go somewhere",
                  "style": "primary",
                  "items": "{posters}",
                  "itemTitle": "title",
                  "itemDescription": "storyline",
                  "itemPhoto": "posterurl",
                  "action": FindMoviesAction,
                  "sort": {
                    "match": "title",
                    "order": "asc"
                  },
                  "filter": [
                    {
                      "match": "genres",
                      "type": "contains",
                      "value": "Comedy"
                    }
                  ],
                }
              ]
            },
            {
              "label": "Action",
              "components": [
                {
                  "type": "Card",
                  "title": "Card title",
                  "src": "sunset.jpg",
                  "visible": true,
                  "description": "Some quick example text to build on the card title and make up the bulk of the card's content.",
                  "button": "Go somewhere",
                  "style": "primary",
                  "items": "{posters}",
                  "itemTitle": "title",
                  "itemDescription": "storyline",
                  "itemPhoto": "posterurl",
                  "action": FindMoviesAction,
                  "sort": {
                    "match": "title",
                    "order": "asc"
                  },
                  "filter": [
                    {
                      "match": "genres",
                      "type": "contains",
                      "value": "Action"
                    }
                  ],
                }
              ]
            },
            {
              "label": "Max",
              "components": []
            }
          ]
        },
        {
          "type": "Spinner",
          "visible": true
        },
        {
          "type": "Progress",
          "value": 30
        },

        {
          "type": "Searchfield",
          "label": "Searchfield",
          "required": true,
          "value ": "{searchfieldValue}",
          "items": "{global:movies}",
          "actions": SearchfieldAction,
          "itemKey": "title",
          "itemLabel": "title",
          "itemsEmpty": "Fant ingen filmer",
          "help": "Begynn å skriv inn navn på filmer",
          "sort": {
            "match": "title",
            "order": "asc"
          },
          "filter": [
            {
              "match": "genres",
              "type": "contains",
              "value": "Action"
            }
          ],
        },
        {
          "type": "Datepicker",
          "label": "Datepicker",
          "required": true,
          "states": {
            "value": "datepickerValue"
          },
          "format": "yyyy.mm.dd",
          "value": "2008.10.25"
        },
        {
          "type": "Toolbar",
          "actions": [
            {
              "type": "Button",
              "label": "Open dialog",
              "style": "warning",
              "action": ShowDialogAction
            }
          ]
        },
        {
          "type": "Progress",
          "value": "50",
          "states": {
            "value": "progress"
          }
        },
        {
          "type": "Spinner",
          "visible": true,
          "value": 50
        },
        {
          "type": "Toolbar",
          "actions": [
            {
              "type": "Button",
              "label": "ToolbarKnapp",
              "style": "danger",
              "action": ShowDialogAction
            }
          ]
        },
        {
          "type": "Alert",
          "style": "success",
          "visible": true,
          "closable": true,
          "text": "Here comes the error message"
        },
        {
          "type": "Button",
          "label": "Inbox",
          "enabled": true,
          "style": "primary",
          "badge": 5,
          "action": ShowDialogAction,
          "layout": {
            "col-md": "12"
          }
        },
        {
          "type": "Textfield",
          "label": "Textfield",
          "required": true,
          "value": "",
          "help": "Here is the help",
          "placeholder": "Placeholder here...",
          "validation": {
            "pattern": "hh:mm:ss",
            "regex": "^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$",
            "message": "Please enter valid hour"
          },
          "before": {
            "icon": "glyphicon-time",
            "text": "$"
          }
        },
        {
          "type": "Table",
          "label": "Table",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{global:movies}",
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
          ],
          "sort": {
            "match": "year",
            "order": "asc"
          },
          "filter": [
            {
              "match": "genres",
              "type": "contains",
              "value": "Action"
            }
          ],
          "paging": {
            "size": 10,
            "page": 0,
          }
        },
        {
          "type": "Pulldown",
          "label": "Pulldown",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{movies}",
          "required": true,
          "sort": {
            "match": "year",
            "order": "asc"
          },
          "filter": [
            {
              "match": "genres",
              "type": "contains",
              "value": "Action"
            }
          ]
        },
        {
          "type": "Radio",
          "label": "Radio",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{movies}",
          "sort": {
            "match": "year",
            "order": "asc"
          },
          "filter": [
            {
              "match": "genres",
              "type": "contains",
              "value": "Action"
            }
          ]
        },
        {
          "type": "Checkbox",
          "label": "Checkbox",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{movies}",
          "sort": {
            "match": "year",
            "order": "asc"
          },
          "filter": [
            {
              "match": "genres",
              "type": "contains",
              "value": "Action"
            }
          ]
        },
        {
          "type": "Dialog",
          "visible": "{dialogVisible}",
          "title": "Dialog",
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
              "style": "primary",
              "action": CloseDialogAction
            },
            {
              "type": "Button",
              "label": "Cancel",
              "style": "secondary",
              "action": CloseDialogAction
            }
          ]
        },
      ]
    };
  }

  viewEnabled() {
    //console.info("InboxView.viewEnabled");
    //this.runSmartflow(new StartAction());
    //this.runSmartflow(new FindTableAction());
    this.runSmartflow(new FindMoviesAction());
    this.runSmartflow(new FindGlobalMovies());
    this.runSmartflow(new FindPostersAction());
  }

  componentChanged(evt) {
  }
  actionPerformed(evt){
  }

  stateChanged(state, value){
    //console.info("StateChange: ", state, value);
  }

  globalChanged(state, value){
    //console.info("globalChanged: ", state, value);
  }
}
