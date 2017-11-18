import {ClientAction} from "../../../src/Action";

export class GotoMovieAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/catalog/{global:selectedMovie}"
    }
  }
}
