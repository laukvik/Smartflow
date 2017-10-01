import {Action} from "../../../src/Action";

export class SearchfieldAction extends Action {
  getSmartflow() {
    return {
      "request": {
        "url": "movies.json",
        "method": "get",
        "type": "json"
      },
      "success": {
        "path": "/",
        "state": "searchfieldRows"
      },
      "error": {
        "path": "/",
        "state": "searchfieldRowsFailed"
      }
    }
  }
}
