import {SmartflowComponent} from "../component";

export class Button extends SmartflowComponent {
  constructor(properties) {
    super(properties);
  }

  setAttribute(node, name, value){
    node.setAttribute(name, value);
  }

  buildComponent(builder, properties){
    this.buttonNode = document.createElement("button");
    if (properties.id){
      this.buttonNode.setAttribute("id", properties.id);
    }
    this.buttonNode.setAttribute("class", "btn btn-default" + (properties.class ? " " + properties.class : ""));
    this.action = properties.action;
    this.setText(properties.label);
    this.buttonNode.addEventListener("click", function () {
      this._clicked(properties);
    }.bind(this), false);
    return this.buttonNode;
  }

  _clicked(action){
    this.fireAction(action.action);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.buttonNode.removeAttribute("disabled");
    } else {
      this.buttonNode.setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this.buttonNode.innerText = text;
  }

  getText() {
    return this.buttonNode.innerText;
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

