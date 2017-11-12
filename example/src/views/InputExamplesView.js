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

export class InputExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/input",
      "components": [
        {
          "type": Textfield,
          "label": "Email",
          "textfieldType": TextfieldType.EMAIL,
          "validation": "Email address is required",
          "help": "Please enter your email address",
          "required": true,
          "placeholder": "",
          "after": "@gmail.com",
          "readOnly": false
        },
        {
          "type": Datepicker,
          "label": "Date",
          "value": "2017-02-24",
          "help": "Enter your birthday",
          "itemKey": "releaseDate",
          "itemLabel": "title",
          "items": "{global:movies}"
        },
        {
          "type": NumberField,
          "label": "NumberField",
          "validation": "Illegal value",
          "help": "Enter a number between -50 and 50",
          "required": true,
          "placeholder": "",
          "before": "USD",
          "after": ".00",
          "min": -50,
          "max": 50,
          "step": 0.1
        },
        {
          "type": Searchfield,
          "label": "Search",
          "placeholder": "Search movies",
          "help": "Find your favorite movie by typing the first letter",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{global:movies}"
        },
        {
          "type": Radio,
          "label": "Radio",
          "itemKey": "year",
          "itemLabel": "year",
          "items": "{global:movies}",
          "distinct": "year",
          "sort": {
            "match": "title",
            "order": "asc"
          }
        },
        {
          "type": Checkbox,
          "label": "Checkbox",
          "itemKey": "year",
          "itemLabel": "year",
          "items": "{global:movies}",
          "distinct": "year",
          "sort": {
            "match": "title",
            "order": "asc"
          }
        },
        {
          "type": Pulldown,
          "label": "Pulldown",
          "help": "Select a movie you like",
          "itemKey": "title",
          "itemLabel": "title",
          "items": "{global:movies}",
          "distinct": "year",
          "sort": {
            "match": "title",
            "order": "asc"
          }
        }
      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
