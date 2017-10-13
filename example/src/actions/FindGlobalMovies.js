import {ServerAction} from "../../../src/ServerAction";

export class FindGlobalMovies extends ServerAction {
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
