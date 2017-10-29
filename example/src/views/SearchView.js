import {View} from "../../../src/View";
import {Searchfield} from "../../../src/components/Searchfield";
import {GotoMovieAction} from "../actions/GotoMovieAction";
import {FindMoviesAction} from "../actions/FindMoviesAction";
import {Card} from "../../../src/components/Card";
import {Button, ButtonStyle} from "../../../src/components/Button";

export class SearchView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": Card,
          "title": "Latin",
          "description": "Lorem ipsum sit amet.",
          "photo": "",
          "button": {
            "type": Button,
            "label": "Send",
            "style": ButtonStyle.PRIMARY,
            "action": GotoMovieAction
          }
        },
        {
          "type": Searchfield,
          "id": "mySearchfield",
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
            "description": "storyline",
            "photo": "porterurl"
          }
        }
      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
