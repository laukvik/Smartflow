import {SmartflowComponent} from "../component";

export class Spinner extends SmartflowComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
  }

  setProperties(properties) {
    this.setVisible(properties.visible);
  }

  buildComponent(builder, properties) {
    this._componentNode.setAttribute("class", "sf-spinner" + (properties.class ? " " + properties.class : ""));
    let icon = document.createElement("span");
    icon.setAttribute("class", "glyphicon glyphicon-repeat sf-spinner-animation");
    this._componentNode.appendChild(icon);
    return this._componentNode;
  }

  setVisible(isEnabled) {
    if (isEnabled == true) {
      this._componentNode.style.display = "block";
    } else {
      this._componentNode.style.display = "none";
    }
  }


  stateChanged(state, value) {
    if (state == this.properties.states.visible) {
      this.setVisible(value);
    }
  }
}

