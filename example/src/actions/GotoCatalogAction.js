import {ClientAction} from "../../../src/Action";

export class GotoCatalogAction extends ClientAction {

  getSmartflow() {
    return {
      "path": "/catalog",
      "global": {
        "listView": "true"
      }
    }
  }
}
