import {SmartflowComponent} from "../component";

export class Alert extends SmartflowComponent {
  constructor(properties) {
    super(properties);
    this.pickerNode = document.createElement("div");
    this.pickerNode.setAttribute("role", "alert");
  }

  buildComponent(builder, properties){
    if (properties.id){
      this.pickerNode.setAttribute("id", properties.id);
    }
    this.pickerNode.setAttribute("class", "sf-alert alert alert-danger" + (properties.class ? " " + properties.class : ""));


    this.srNode = document.createElement("span");
    this.srNode.setAttribute("class", "sr-only");
    this.srNode.innerText = "Error:";

    this.iconNode = document.createElement("span");
    this.iconNode.setAttribute("class", "glyphicon glyphicon-exclamation-sign");
    this.iconNode.setAttribute("aria-hidden", "true");

    this.textNode = document.createTextNode("");

    this.pickerNode.appendChild(this.iconNode);
    this.pickerNode.appendChild(this.srNode);
    this.pickerNode.appendChild(this.textNode);

    this.setText(properties.text);

    return this.pickerNode;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.pickerNode.removeAttribute("disabled");
    } else {
      this.pickerNode.setAttribute("disabled", "true");
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

