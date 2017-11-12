import {View} from "../../../src/View";
import {Items} from "../../../src/components/Items";
import {Text} from "../../../src/components/Text";
import {FindMoviesAction} from "../actions/FindMoviesAction";
import {ButtonStyle} from "../../../src/components/Button";
import {Card} from "../../../src/components/Card";


export class ItemsExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/items",
      "components": [

        {
          "type": Text,
          "title": "Morten",
          "label": "Morten"
        },
        {
          "type": Items,
          "items": "{global:movies}",
          "layout": [3,3,3,3],
          "component": {
            "type": Card,
            "photo": "posterurl",
            "title": "title",
            "description": "storyline",
            "button": {
              "label": "GO",
              "action": FindMoviesAction,
              "buttonStyle": ButtonStyle.DANGER
            }
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
        }
      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
