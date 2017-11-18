import {View} from "../../../src/View";

import {FindMoviesAction} from "../actions/FindMoviesAction";
import {Card} from "../../../src/components/Card";
import {BadgeShape, BadgeStyle, Button, ButtonSize, ButtonStyle, Outline} from "../../../src/components/Button";
import {Items} from "../../../src/components/Items";
import {Table} from "../../../src/components/Table";
import {Photo} from "../../../src/components/Photo";
import {Duration} from "../components/Duration";


export class TableExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/table",
      "components": [

        {
          "type": Table,
          "columns": [
            {
              "label": "Poster",
              "key": "title",
              "component": {
                "type": Photo,
                "url": "{posterurl}",
                "width": "100"
              }
            },
            {
              "label": "Title",
              "key": "title"
            },
            {
              "label": "Genre",
              "key": "genres"
            },
            {
              "label": "Duration",
              "key": "duration",
              "component": {
                "type": Duration,
                "value": "{duration}"
              }
            },
            {
              "label": "Year",
              "key": "year"
            }
          ],
          "items": "{global:movies}",
          "filter":
            {
              "match": "year",
              "type": "is",
              "value": "{view:selectedYear}"
            }
          ,
          "sort": {
            "match": "title",
            "order": "asc"
          },

        }

      ]
    };
  }

  viewInitialized() {
  }

}
