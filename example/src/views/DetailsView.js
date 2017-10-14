/**
 * Shows details for a single movie
 */
import {View} from "../../../src/View";
import {Text} from "../../../src/components/Text";
import {Table} from "../../../src/components/Table";

export class DetailsView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/catalog/{id}",
      "components": [
        {
          "type": Text,
          "Heading": "Movie details",
          "value": "Shows the details for a movie"
        },
        {
          "type": Table,
          "columns": [
            {
              "label": "Title",
              "key": "title"
            },
            {
              "label": "Genre",
              "key": "genres"
            },
            {
              "label": "Year",
              "key": "year"
            },
          ],
          "items": "{global:movies}"
        }
      ]
    };
  }

}
