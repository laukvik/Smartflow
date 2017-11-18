import {ClientAction} from "../../../src/Action";

export class EditMovieAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/catalog/{id}"
    }
  }
}
