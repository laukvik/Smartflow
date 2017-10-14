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
          "action": GotoMovieAction
        }
      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
