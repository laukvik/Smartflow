/**
 * Shows details for a single movie
 */
import {View} from "../../../src/View";
import {Text} from "../../../src/components/Text";

export class DetailsView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/catalog/{id}",
      "components": [
        {
          "type": Text,
          "heading": "{global:selectedMovie}",
          "text": "Shows the details for a movie"
        },
      ]
    };
  }

}
