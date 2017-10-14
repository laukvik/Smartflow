import {ClientAction} from "../../../src/ClientAction";

export class EditMovieAction extends ClientAction {

  getSmartflow() {
    return {
      "states": {
        "dialogVisible" : true
      }
    }
  }
}
