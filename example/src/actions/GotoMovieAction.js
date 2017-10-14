import {ClientAction} from "../../../src/ClientAction";

export class GotoMovieAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/catalog/12"
    }
  }
}
