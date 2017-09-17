import {View} from "../../src/View";
import {CloseDialogAction,FindMoviesAction,FindTableAction,ShowDialogAction,StartAction} from "./actions";

export class InboxView extends View {
  constructor() {
    super();

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
                      "type": "Alert",
                      "text": "Here comes the error message"
                    },
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
                      "states": {
                        "enabled": "buttonEnabled",
                        "value": "button"
                      },
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
                          "action": CloseDialogAction
                        },
                        {
                          "type": "Button",
                          "label": "Cancel",
                          "action": CloseDialogAction
                        }
                      ]
                    },
                    {
                      "type": "Toolbar",
                      "actions": [
                        {
                          "type": "Button",
                          "label": "Open dialog",
                          "action": ShowDialogAction
                        }
                      ]
                    },
                    {
                      "type": "Progress",
                      "value": "0",
                      "states": {
                        "value": "progress"
                      }
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
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  viewEnabled() {
    console.info("InboxView.viewEnabled");
    this.runSmartflow(new StartAction());
    //this.runSmartflow(new FindMoviesAction());
    this.runSmartflow(new FindTableAction());
  };

  componentChanged(evt) {
    console.info("InboxView.componentChanged: ", evt);
  }
}
