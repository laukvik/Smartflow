/**
 * Shows a search field. Searches for movies. When clicking on a
 * movie title will navigate to EditMovieView
 *
 *
 */
import {View} from "../../../src/View";
import {Searchfield} from "../../../src/components/Searchfield";
import {GotoMovieAction} from "../actions/GotoMovieAction";
import {FindMoviesAction} from "../actions/FindMoviesAction";
import {Card} from "../../../src/components/Card";

export class SearchView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": Searchfield,
          "label": "Search",
          "value": "{global:selectedMovie}",
          "placeholder": "Enter name of a movie",
          "items": "{global:movies}",
          "itemKey": "title",
          "itemLabel": "title",
          "itemsEmpty": "No movies found",
          "selected": "{global:selectedMovie}",
          "selectAction": GotoMovieAction,
          "component": {
            "type": Card,
            "title": "title",
            "description": "storyline"
          }
        }
      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
