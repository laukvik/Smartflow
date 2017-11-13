import {View} from "../../../src/View";

import {FindMoviesAction} from "../actions/FindMoviesAction";
import {BadgeShape, BadgeStyle, Button, ButtonSize, ButtonStyle, Outline} from "../../../src/components/Button";
import {Toolbar} from "../../../src/components/Toolbar";


export class ButtonExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/buttons",
      "components": [

        {
          "type": Button,
          "label": "Primary",
          "buttonStyle": ButtonStyle.PRIMARY
        },

        {
          "type": Toolbar,
          "label": "Send",
          "actions": [
            {
              "type": Button,
              "label": "New",
              "buttonStyle": ButtonStyle.SECONDARY
            },
            {
              "type": Button,
              "label": "Open",
              "buttonStyle": ButtonStyle.WARNING
            },
            {
              "type": Button,
              "label": "Save",
              "buttonStyle": ButtonStyle.DANGER
            },
          ]
        },


      ]
    };
  }

  viewInitialized() {
    this.runAction(new FindMoviesAction());
  }

}
