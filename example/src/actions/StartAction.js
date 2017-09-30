import {Action} from "../../../src/Action";


export class StartAction extends Action {
  getSmartflow() {
    return {
      "global": {
        "tekst": "Denne kommer fra global!!!"
      },
      "states": {
        "tekst": "Denne kommer fra private!!!",
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


