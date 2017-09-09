class Button extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    var buttonNode = document.createElement("button");
    buttonNode.setAttribute("id", comp.id);
    buttonNode.setAttribute("class", "sf-button");
    this.action = comp.action;
    this.setElement(buttonNode);
    this.setText(comp.label);
    var self = this;
    buttonNode.addEventListener("click", function () {
      self.fireAction(self.action);
    }.bind(this), false);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.getElement().removeAttribute("disabled");
    } else {
      this.getElement().setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this.getElement().innerText = text;
  }

  getText() {
    return this.getElement().innerText;
  }

  stateChanged(state, value) {
    if (state == this.comp.states.value) {
      this.setText(value);
    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    }
  }
}

