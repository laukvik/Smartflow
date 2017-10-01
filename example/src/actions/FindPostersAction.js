import {Action} from "../../../src/Action";

export class FindPostersAction extends Action {
  getSmartflow() {
    return {
      "request": {
        "url": "posters.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "path": "/",
        "state": "posters",
      },
      "error": {
        "path": "/",
        "state": "postersFailed"
      }
    }
  }
}
