import {View} from "../../../src/View";
import {Searchfield} from "../../../src/components/Searchfield";
import {Textfield, TextfieldType} from "../../../src/components/Textfield";
import {Radio} from "../../../src/components/Radio";
import {Checkbox} from "../../../src/components/Checkbox";
import {Pulldown} from "../../../src/components/Pulldown";
import {NumberField} from "../../../src/components/NumberField";
import {Datepicker} from "../../../src/components/Datepicker";
import {Layout,LayoutSize} from "../../../src/components/Layout";

export class InputExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/input",
      "components": [
        {
          "type": Layout,
          "components": [


            {
              "type": Textfield,
              "label": "Email",
              "textfieldType": TextfieldType.EMAIL,
              "validation": "Email address is required",
              "help": "Please enter your email address",
              "value": "",
              "required": true,
              "placeholder": "",
              "after": "@gmail.com",
              "readOnly": false,
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 5,
              }
            },
            {
              "type": Datepicker,
              "label": "Date",
              "value": "2017-02-24",
              "help": "Enter your birthday",
              "itemKey": "releaseDate",
              "itemLabel": "title",
              "items": "{global:movies}",
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 3,
              }
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
              "step": 0.1,
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 4,
              }
            },
            {
              "type": Searchfield,
              "label": "Search",
              "placeholder": "Search movies",
              "help": "Find your favorite movie by typing the first letter",
              "itemKey": "title",
              "itemLabel": "title",
              "items": "{global:movies}",
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 3,
              }
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
              },
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 3,
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
              },
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 3,
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
              },
              "layout": {
                "md": 6,
                "lg": 4,
                "xl": 3,
              }
            }
          ]
        },
      ]
    };
  }

  viewInitialized() {
  }

}
