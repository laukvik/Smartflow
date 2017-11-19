import {Component} from "../Component";

export class Spinner extends Component {

  constructor() {
    super();
    this.createComponentNode("div");
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else {
      console.warn("Spinner: Unknown property ", name);
    }
  }

  buildComponent(builder, properties) {
    let icon = document.createElement("span");
    icon.setAttribute("class", "glyphicon glyphicon-repeat sf-spinner-animation");
    this._componentNode.appendChild(icon);
    return this._componentNode;
  }

  setVisible(isEnabled) {
    if (isEnabled === true) {
      this._componentNode.style.display = "block";
    } else {
      this._componentNode.style.display = "none";
    }
  }

}

