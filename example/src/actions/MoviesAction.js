import {Action} from "../../../src/Action";

export class FindMoviesAction extends Action {
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
