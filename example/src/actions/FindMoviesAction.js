import {ServerAction} from "../../../src/ServerAction";

export class FindMoviesAction extends ServerAction {

  getSmartflow() {
    return {
      "request": {
        "url": "posters.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "global": "movies",
      },
      "error": {
        "global": "moviesFailed"
      }
    }
  }
}
