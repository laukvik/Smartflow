import {ServerAction} from "../../../src/ServerAction";

export class FindMoviesAction extends ServerAction {
  getSmartflow() {
    return {
      "request": {
        "url": "movies.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "path": "/",
        "state": "movies",
      },
      "error": {
        "path": "/",
        "state": "moviesFailed"
      }
    }
  }
}
