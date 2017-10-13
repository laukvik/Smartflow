import {ClientAction} from "../../../src/ClientAction";

export class CloseDialogAction extends ClientAction {

  getSmartflow() {
    return {
      "states": {
        "dialogVisible": false
      }
    }
  }
}
