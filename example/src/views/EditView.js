/**
 *
 */
import {View} from "../../../src/View";
import {Text} from "../../../src/components/Text";

/**
 * Edits an exising movie
 *
 *
 */
export class EditView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/catalog/{id}/edit",
      "components": [
        {
          "type": Text,
          "Heading": "Edit movie",
          "value": "Lets you change the movie details"
        }
      ]
    };
  }

}
