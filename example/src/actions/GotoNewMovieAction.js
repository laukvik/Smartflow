import {ClientAction} from "../../../src/Action";

export class GotoNewMovieAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/new"
    }
  }
}
