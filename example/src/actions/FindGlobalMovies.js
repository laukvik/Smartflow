import {Action} from "../../../src/Action";

export class FindGlobalMovies extends Action {
  getSmartflow() {
    return {
      "request": {
        "url": "movies.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "path": "/",
        "global": "movies",
      },
      "error": {
        "path": "/",
        "global": "moviesFailed"
      }
    }
  }
}
