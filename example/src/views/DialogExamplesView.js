import {View} from "../../../src/View";
import {Button, ButtonSize, ButtonStyle} from "../../../src/components/Button";
import {Dialog} from "../../../src/components/Dialog";
import {Text} from "../../../src/components/Text";
import {CloseAlertDialogAction,OpenAlertAction} from "../actions/AlertDialogAction";

export class DialogExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/dialogs",
      "components": [
        {
          "type": Button,
          "label": "Open alert",
          "buttonStyle": ButtonStyle.INFO,
          "action": OpenAlertAction
        },
        {
          "type": Button,
          "label": "Open confirm",
          "buttonStyle": ButtonStyle.PRIMARY,
          "action": null
        },
        {
          "type": Button,
          "label": "Open custom",
          "buttonStyle": ButtonStyle.PRIMARY,
          "action": null
        },
        {
          "type": Dialog,
          "title": "Dialog title",
          "open": "{global:dialogAlertOpen}",
          "components": [
            {
              "type": Text,
              "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
          ],
          "buttons": [
            {
              "type": Button,
              "label": "Save changes",
              "buttonStyle": ButtonStyle.PRIMARY,
              "size": ButtonSize.SMALL,
              "action": CloseAlertDialogAction
            },
            {
              "type": Button,
              "label": "Cancel",
              "buttonStyle": ButtonStyle.DEFAULT,
              "size": ButtonSize.SMALL,
              "action": CloseAlertDialogAction
            },
          ]
        },

      ]
    };
  }

  viewInitialized() {
  }

}
