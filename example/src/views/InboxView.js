import {View} from "../../../src/View";
import {FindMoviesAction} from "../actions/MoviesAction";
import {StartAction} from "../actions/StartAction";
import {SearchfieldAction} from "../actions/SearchfieldAction";
import {CloseDialogAction} from "../actions/CloseDialogAction";
import {FindTableAction} from "../actions/FindTableAction";
import {ShowDialogAction} from "../actions/ShowDialogAction";

export class InboxView extends View {
  constructor() {
    super();

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": "Tabs",
          "selectedIndex": 0,
          "tabs": [
            {
              "label": "Minimum",
              "components": [
                {
                  "type": "Alert",
                  "style": "success",
                  "visible": true,
                  "closable": true,
                  "text": "Here comes the error message"
                },
                {
                  "type": "Checkbox",
                  "label": "Checkbox",
                  "required": true,
                  // "states": {
                  //   "options": "checkboxes",
                  //   "selected": "selectedCheckboxes",
                  //   "enabled": "checkboxEnabled",
                  //   "required": "checkboxRequired",
                  //   "label": "checkboxLabel"
                  // },
                  "optionsState": "checkboxes",
                  "selected": [
                    "0", "2"
                  ],
                  "options": [
                    {"text": "Fish", "value": "0"},
                    {"text": "Eggs", "value": "1"},
                    {"text": "Milk", "value": "2"}
                  ],
                  "layout": {
                    "col-md": "6",
                    "col-lg": "4"
                  }
                },
                {
                  "type": "Radio",
                  "label": "Radio",
                  "required": true,
                  "vertical": "false",
                  "selected": "1",
                  // "states": {
                  //   "options": "radios",
                  //   "selected": "selectedRadio",
                  //   "enabled": "radioEnabled",
                  //   "required": "radioRequired",
                  //   "label": "radioLabel"
                  // },
                  "options": [
                    {"text": "Fish", "value": "0"},
                    {"text": "Eggs", "value": "1"},
                    {"text": "Milk", "value": "2"}
                  ],
                  "layout": {
                    "col-md": "6",
                    "col-lg": "4"
                  },

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
                  "layout": {
                    "col-md": "6",
                    "col-lg": "4"
                  }
                }
                ,
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
                  },
                  "after": {
                    "icon": "glyphicon-calendar",
                    "text": "$"
                  },
                  // "icon_before": "glyphicon-time",
                  // "icon_after": "glyphicon-calendar",
                  // "states": {
                  //   "enabled": "textfieldEnabled",
                  //   "value": "textfield",
                  //   "required": "textfieldRequired",
                  //   "label": "textfieldLabel"
                  // },
                  "layout":{
                    "col-md": "6",
                    "col-lg": "12"
                  }

                },
                {
                  "type": "Textfield",
                  "label": "Textarea",
                  "required": true,
                  "rows": 10,
                  "placeholder": "Placeholder here...",
                  "layout":{
                    "col-md": "12"
                  }
                },
                {
                  "type": "Button",
                  "label": "Button",
                  "enabled": true,
                  "style": "success",
                  "action": FindMoviesAction,
                  "layout": {
                    "col-md": "12"
                  }
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
                {
                  "type": "Searchfield",
                  "label": "Searchfield",
                  "states": {
                    "value": "searchfieldValue",
                    "rows": "searchfieldRows"
                  },
                  "action": SearchfieldAction,
                  "key": "title",
                  "presentation": "title",
                  "sort": {
                    "match": "title",
                    "order": "asc"
                  }
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
                }

              ]
            },
            {
              "label": "Table",
              "components": [
                {
                  "type": "Table",
                  "id": "inboxTable",
                  "class": "table table-striped",
                  "rowKey": "title",
                  "selectable": "false",
                  "layout":{
                    "col-md": "12",
                    "col-lg": "12",
                  },

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
                },
              ]
            }
          ]
        }
      ]
    };
  }

  viewEnabled() {
    //console.info("InboxView.viewEnabled");
    //this.runSmartflow(new StartAction());
    //this.runSmartflow(new FindTableAction());
    //this.runSmartflow(new FindMoviesAction());
  }

  componentChanged(evt) {
  }
  actionPerformed(evt){
  }
}
