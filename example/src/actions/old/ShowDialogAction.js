import {ClientAction} from "../../../src/ClientAction";

export class ShowDialogAction extends ClientAction {
  getSmartflow() {
    return {
      "states": {
        "dialogVisible" : true
      }
    }
  }
}
