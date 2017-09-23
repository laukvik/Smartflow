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
    let icon = document.createElement("span");
    icon.setAttribute("class", "glyphicon glyphicon-repeat sf-spinner-animation");
    this.spinnerNode.appendChild(icon);
    this.setVisible(properties.visible);
    return this.spinnerNode;
  }

  setVisible(isEnabled) {
    if (isEnabled == true) {
      this.spinnerNode.style.display = "block";
    } else {
      this.spinnerNode.style.display = "none";
    }
  }


  stateChanged(state, value) {
    if (state == this.properties.states.visible) {
      this.setVisible(value);
    }
  }
}

