import {View} from "../../../src/View";
import {Items} from "../../../src/components/Items";

export class InboxView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/inbox",
      "components": [
        {
          "type": "Textfield",
          "label": "Filter",
          "required": true,
          "value": "{filter}",
          "placeholder": "Search...",
          "dust": "fjomp"
        },
        {
          "type": "Card",
          "title": "Første",
          "description": "{filter}",
          "_photo": "posterurl"
        },
        {
          "type": "Alert",
          "text": "{filter}",
          "style": "info"
        },
        {
          "type": Items,
          "items": "{posters}",
          "component": {
            "type": "Card",
            "title": "title",
            "description": "storyline",
            "_photo": "posterurl"
          },
          "sort": {
            "match": "title",
            "order": "asc"
          },
          "filter":
            {
              "match": "storyline",
              "type": "contains",
              "value": "{filter}"
            }
          ,
          "paging": {
            "size": 10,
            "page": 0
          }
        },
      ]
    };
  }

  viewEnabled() {
    // this.runAction(new StartAction());
    // this.runAction(new FindTableAction());
    // this.runAction(new FindMoviesAction());
    // this.runAction(new FindGlobalMovies());
    this.runAction(new FindPostersAction());
  }

  componentChanged(evt) {
  }

  actionPerformed(evt){
  }

  stateChanged(state, value){
  }

  globalChanged(state, value){
  }
}
