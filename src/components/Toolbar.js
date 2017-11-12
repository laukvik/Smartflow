import {InputComponent} from "../InputComponent";

export class Toolbar extends InputComponent {

  constructor(properties) {
    super(properties);
    this.buttons = [];
    this.actions = [];
    this.createComponentNode("div");
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    }
  }

  setProperties(properties) {
    this.removeChildNodes(this._groupNode);
    if (Array.isArray(properties.actions)) {
      for (let x = 0; x < properties.actions.length; x++) {
        let component = properties.actions[x];
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn " + (component.buttonStyle ? " " + component.buttonStyle : ""));
        btn.innerText = component.label;
        this._groupNode.appendChild(btn);
        this.buttons.push(btn);
        btn.addEventListener("click", function () {
          this._clicked(properties.actions[x].action);
        }.bind(this), false);
      }
    }
  }

  buildComponent(builder, properties) {
    this._componentNode.setAttribute("role", "toolbar");
    let groupNode = document.createElement("div");
    groupNode.setAttribute("class", "btn-group");
    this._componentNode.appendChild(groupNode);
    this._groupNode = groupNode;
    return this._componentNode;
  }

  _clicked(action) {
    this.fireAction(action);
  }
}

