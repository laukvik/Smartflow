import {ServerAction} from "../../../src/ServerAction";

export class FindPostersAction extends ServerAction {
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
