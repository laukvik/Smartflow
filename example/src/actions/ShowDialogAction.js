import {Action} from "../../../src/Action";

export class ShowDialogAction extends Action {
  getSmartflow() {
    return {
      "states": {
        "dialogVisible" : true
      }
    }
  }
}
