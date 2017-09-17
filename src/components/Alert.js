import {SmartflowComponent} from "../component";

export class Alert extends SmartflowComponent {
  constructor(properties) {
    super(properties);
    this.alertNode = document.createElement("div");
    this.alertNode.setAttribute("role", "alert");
  }

  buildComponent(builder, properties){
    if (properties.id){
      this.alertNode.setAttribute("id", properties.id);
    }
    this.alertNode.setAttribute("class", "sf-alert alert alert-danger" + (properties.class ? " " + properties.class : ""));


    this.srNode = document.createElement("span");
    this.srNode.setAttribute("class", "sr-only");
    this.srNode.innerText = "Error:";

    this.iconNode = document.createElement("span");
    this.iconNode.setAttribute("class", "glyphicon glyphicon-exclamation-sign");
    this.iconNode.setAttribute("aria-hidden", "true");

    this.textNode = document.createTextNode("");

    this.alertNode.appendChild(this.iconNode);
    this.alertNode.appendChild(this.srNode);
    this.alertNode.appendChild(this.textNode);

    this.setText(properties.text);

    return this.alertNode;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.alertNode.removeAttribute("disabled");
    } else {
      this.alertNode.setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this.textNode.textContent = text;
  }

  getText() {
    return this.textNode.textContent;
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

