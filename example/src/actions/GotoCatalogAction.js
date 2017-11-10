import {ClientAction} from "../../../src/ClientAction";

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