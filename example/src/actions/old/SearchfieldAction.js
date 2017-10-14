import {ServerAction} from "../../../src/ServerAction";

export class SearchfieldAction extends ServerAction {
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
