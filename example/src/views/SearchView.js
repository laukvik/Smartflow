import {View} from "../../../src/View";
import {Searchfield} from "../../../src/components/Searchfield";
import {GotoMovieAction} from "../actions/GotoMovieAction";
import {FindMoviesAction} from "../actions/FindMoviesAction";
import {Card} from "../../../src/components/Card";
import {BadgeShape, BadgeStyle, Button, ButtonSize, ButtonStyle, Outline} from "../../../src/components/Button";
import {Alert, AlertStyle} from "../../../src/components/Alert";
import {Textfield, TextfieldType} from "../../../src/components/Textfield";
import {Radio} from "../../../src/components/Radio";
import {Checkbox} from "../../../src/components/Checkbox";
import {Pulldown} from "../../../src/components/Pulldown";
import {NumberField} from "../../../src/components/NumberField";
import {Datepicker} from "../../../src/components/Datepicker";

export class SearchView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": Searchfield,
          "label": "Search",
          "placeholder": "Search movies",
          "help": "Find your favorite movie by typing the first letter",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{global:movies}"
        }
      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
