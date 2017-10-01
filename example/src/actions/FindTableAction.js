import {Action} from "../../../src/Action";


export class FindTableAction extends Action {
  getSmartflow() {
    return {
      "states": {
        "tableSelected": [
          "Uncertain", "Wilson", "Baby-bossen"
        ],
        "tableSorted": {
          "match": "title",
          "order": "asc"
        },
        "tableFilter": [
          {
            "match": "year",
            "type": "contains",
            "value": "201"
          }
        ],
        "tableColumns": [
          {
            "label": "Title",
            "key": "title"
          },
          {
            "label": "Genre",
            "key": "genres"
          },
          {
            "label": "Year",
            "key": "year"
          },
        ],
        "tableSelectable": true,
        "progress": 22,
      }
    }
  }
}
