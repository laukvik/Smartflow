/**
 * Toolbar with links to index, catalog, posters and a add movie button
 *
 */
import {View} from "../../../src/View";
import {GotoSearchAction} from "../actions/GotoSearchAction";
import {GotoCatalogAction} from "../actions/GotoCatalogAction";
import {GotoNewMovieAction} from "../actions/GotoNewMovieAction";

export class NavigationView extends View {

  constructor() {
    super();

    this.smartflow = {
      "components": [
        {
          "type": "Navbar",
          "label": "Movies",
          "buttons": [
            {
              "label": "Search",
              "action": GotoSearchAction
            },
            {
              "label": "Catalog",
              "action": GotoCatalogAction
            },
            {
              "label": "New...",
              "action": GotoNewMovieAction
            }
          ]
        }
      ]
    };
  }

}
