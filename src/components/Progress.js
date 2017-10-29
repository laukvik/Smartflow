import {PresentationComponent} from "../PresentationComponent";

class Progress extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.value = 0;
    this.createComponentNode("div", "Progress");
    this.progressBarNode = document.createElement("div");
    this._componentNode.appendChild(this.progressBarNode);
  }

  setProperty(name, value) {
    if (name === "value") {
      this.setValue(value);
    } else if (name === "visible") {
      this.setVisible(value);
    }
  }

  buildComponent(builder, properties) {
    this.progressBarNode.setAttribute("class", "progress-bar progress-bar-striped progress-bar-animated");
    this.progressBarNode.setAttribute("role", "progressbar");

    return this._componentNode;
  }

  setValue(value) {
    if (value >= 0 && value <= 100) {
      this.value = value;
    } else {
      this.value = 0;
    }
    this.progressBarNode.setAttribute("style", "width: " + value + "%");
  }

  stateChanged(state, value) {
    if (state == this.properties.states.value) {
      this.setValue(value);
    }
  }
}

export {Progress}
