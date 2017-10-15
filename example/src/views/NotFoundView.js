import {View} from "../../../src/View";

/**
 * Shows an error page
 */
export class NotFoundView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/404",
      "components": [
        {
          "type": "Card",
          "title": "Not found",
          "description": "Generic page for showing error messages"
        }
      ]
    };
  }

}
