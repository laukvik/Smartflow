import {ClientAction} from "../../../src/Action";

export class GotoPresentationExamplesAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/examples/presentation"
    }
  }
}
