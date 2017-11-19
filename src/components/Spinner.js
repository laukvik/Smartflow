import {Component} from "../Component";

export class Spinner extends Component {

  constructor() {
    super();
    this.createComponentNode("div");
    this.icon = document.createElement("span");
    this.icon.setAttribute("class", "glyphicon glyphicon-repeat sf-spinner-animation");
    this.getComponentNode().appendChild(this.icon);
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else {
      console.warn("Spinner: Unknown property ", name);
    }
  }

  setVisible(isEnabled) {
    if (isEnabled === true) {
      this._componentNode.style.display = "block";
    } else {
      this._componentNode.style.display = "none";
    }
  }

}

