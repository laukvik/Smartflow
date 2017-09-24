import {SmartflowComponent} from "../component";

class Alert extends SmartflowComponent {

  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this._componentNode.setAttribute("role", "alert");
  }

  setProperties(properties) {
    this.setText(properties.text);
  }

  buildComponent(builder, properties){
    this._componentNode.setAttribute("class", "sf-alert alert alert-danger" + (properties.class ? " " + properties.class : ""));

    this.iconNode = document.createElement("span");
    this.iconNode.setAttribute("class", "glyphicon glyphicon-exclamation-sign");
    this.iconNode.setAttribute("aria-hidden", "true");

    this.srNode = document.createElement("span");
    this.srNode.setAttribute("class", "sr-only");
    this.srNode.innerText = "Error:";

    this.textNode = document.createElement("span");
    this._componentNode.appendChild(this.iconNode);
    this._componentNode.appendChild(this.srNode);
    this._componentNode.appendChild(this.textNode);
    return this._componentNode;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._componentNode.removeAttribute("disabled");
    } else {
      this._componentNode.setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this.textNode.innerText = text;
  }

  stateChanged(state, value) {
    if (state == this.properties.states.value) {
      this.setText(value);
    } else if (state == this.properties.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.properties.states.label) {
      this.setLabel(value);
    }
  }
}

export {Alert}
