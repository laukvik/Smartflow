import {View} from "../../../src/View";

import {FindMoviesAction} from "../actions/FindMoviesAction";
import {Button, ButtonStyle} from "../../../src/components/Button";
import {Toolbar} from "../../../src/components/Toolbar";


export class ButtonExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/buttons",
      "components": [

        {
          "type": Toolbar,
          "label": "Send",
          "buttons": [
            {
              "type": Button,
              "label": "Primary",
              "buttonStyle": ButtonStyle.PRIMARY
            },
            {
              "type": Button,
              "label": "Secondary",
              "buttonStyle": ButtonStyle.SECONDARY
            },
            {
              "type": Button,
              "label": "Warning",
              "buttonStyle": ButtonStyle.WARNING
            },
            {
              "type": Button,
              "label": "Danger",
              "buttonStyle": ButtonStyle.DANGER
            },
            {
              "type": Button,
              "label": "Success",
              "buttonStyle": ButtonStyle.SUCCESS
            },
          ]
        },


      ]
    };
  }

  viewInitialized() {
  }

}
