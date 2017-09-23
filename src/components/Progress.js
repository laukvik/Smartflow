import {PresentationComponent} from "../component";

class Progress extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.value = 0;
    this._componentNode = document.createElement("div");
  }

  setProperties(properties) {

  }

  buildComponent(builder, properties) {

    this._componentNode.setAttribute("class", "progress");
    this._componentNode.setAttribute("class", "sf-progress" + (properties.class ? " " + properties.class : ""));
    this.progressBarNode = document.createElement("div");
    this.progressBarNode.setAttribute("class", "progress-bar progress-bar-striped");
    this.progressBarNode.setAttribute("role", "progressbar");
    this._componentNode.appendChild(this.progressBarNode);
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
