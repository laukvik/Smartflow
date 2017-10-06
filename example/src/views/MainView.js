import {View} from "../../../src/View";

export class MainView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/",
      "components": [
        {
          "type": "Navbar",
          "label": "Smartflow",
          "buttons": [
            {
              "label": "Home",
              "path": "/"
            },
            {
              "label": "Link",
              "path": "/",
              "active": true
            },
            {
              "label": "Disabled",
              "path": "/",
              "enabled": false
            }
          ]
        }
      ]
    };
  }

  viewEnabled() {
  }

  componentChanged(evt) {
  }
  actionPerformed(evt){
  }

  stateChanged(state, value){
  }

  globalChanged(state, value){
  }
}
