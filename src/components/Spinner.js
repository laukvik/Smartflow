import {SmartflowComponent} from "../component";

export class Spinner extends SmartflowComponent {
  constructor(properties) {
    super(properties);
    this.spinnerNode = document.createElement("div");
  }

  buildComponent(builder, properties){
    if (properties.id){
      this.spinnerNode.setAttribute("id", properties.id);
    }
    this.spinnerNode.setAttribute("class", "sf-spinner" + (properties.class ? " " + properties.class : ""));

    return this.spinnerNode;
  }

  setVisible(isEnabled) {
    if (isEnabled) {
      this.spinnerNode.removeAttribute("disabled");
    } else {
      this.spinnerNode.setAttribute("disabled", "true");
    }
  }


  stateChanged(state, value) {
    if (state == this.properties.states.visible) {
      this.setVisible(value);
    } else if (state == this.properties.states.label) {
      this.setLabel(value);
    }
  }
}

