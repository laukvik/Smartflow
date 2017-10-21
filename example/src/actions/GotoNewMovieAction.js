import {ClientAction} from "../../../src/ClientAction";

export class GotoNewMovieAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/new"
    }
  }
}
