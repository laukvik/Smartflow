import {Action} from "../../../src/Action";

export class CloseDialogAction extends Action {

  getSmartflow() {
    return {
      "states": {
        "dialogVisible": false
      }
    }
  }
}
