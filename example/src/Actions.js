import {Action} from "../../src/Action";

export class StartAction extends Action {
  getSmartflow() {
    return {
      "states": {
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
        "dialogVisible": false,
        "datePickerValue": "2010.11.12"
      }
    }
  }
}

export class FindMoviesAction extends Action {
  getSmartflow() {
    return {
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
    }
  }
}

export class FindTableAction extends Action {
  getSmartflow() {
    return {

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
    }
  }
}


export class ShowDialogAction extends Action {
  getSmartflow() {
    return {
      "states": {
        "dialogVisible" : true
      }
    }
  }
}

export class CloseDialogAction extends Action {
  getSmartflow() {
    return {
      "states": {
        "dialogVisible": false
      }
    }
  }
}


export class SearchfieldAction extends Action {
  getSmartflow() {
    return {
      "request": {
        "url": "movies.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "path": "/",
        "state": "searchfieldRows"
      },
      "error": {
        "path": "/",
        "state": "moviesFailed"
      }
    }
  }
}

