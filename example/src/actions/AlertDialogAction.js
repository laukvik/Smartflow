import {ClientAction} from "../../../src/Action";

export class OpenAlertAction extends ClientAction {

  getSmartflow() {
    return {
      "global": {
        "dialogAlertOpen": true
      }
    }
  }
}

export class CloseAlertDialogAction extends ClientAction {

  getSmartflow() {
    return {
      "global": {
        "dialogAlertOpen": false
      }
    }
  }
}
