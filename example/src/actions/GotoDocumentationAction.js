import {ClientAction} from "../../../src/Action";

export class GotoDocumentationAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/documentation"
    }
  }
}
