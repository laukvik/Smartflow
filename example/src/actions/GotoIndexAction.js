import {ClientAction} from "../../../src/ClientAction";

export class GotoIndexAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/"
    }
  }
}
