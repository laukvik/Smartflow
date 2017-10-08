import {View} from "../../../src/View";
import {FindMoviesAction} from "../actions/MoviesAction";
import {FindGlobalMovies} from "../actions/FindGlobalMovies";
import {SearchfieldAction} from "../actions/SearchfieldAction";
import {ShowDialogAction} from "../actions/ShowDialogAction";
import {StartAction} from "../actions/StartAction";
import {CloseDialogAction} from "../actions/CloseDialogAction";
import {FindTableAction} from "../actions/FindTableAction";
import {FindPostersAction} from "../actions/FindPostersAction";

import {Text} from "../../../src/components/Text";
import {Items} from "../../../src/components/Items";

export class InboxView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": "Textfield",
          "label": "Filter",
          "required": true,
          "value": "{filter}",
          "placeholder": "Search...",
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
    // this.runSmartflow(new StartAction());
    // this.runSmartflow(new FindTableAction());
    // this.runSmartflow(new FindMoviesAction());
    // this.runSmartflow(new FindGlobalMovies());
    this.runSmartflow(new FindPostersAction());
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
