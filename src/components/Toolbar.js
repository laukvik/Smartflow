import {InputComponent} from "../component";

export class Toolbar extends InputComponent {
  constructor(properties) {
    super(properties);
    this.buttons = [];
    this.actions = [];
    this._componentNode = document.createElement("div");
  }

  setProperties(properties) {
    this.removeChildNodes(this._groupNode);
    this._componentNode.setAttribute("class", "sf-toolbar btn-toolbar" + (properties.class ? " " + properties.class : ""));
    if (Array.isArray(properties.actions)) {
      for (let x = 0; x < properties.actions.length; x++) {
        let component = properties.actions[x];
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn " + (component.style ? " btn-" + component.style : "btn-default"));


        btn.innerText = component.label;
        this._groupNode.appendChild(btn);
        this.buttons.push(btn);
        btn.addEventListener("click", function () {
          this._clicked(properties.actions[x].action);
        }.bind(this), false);
      }
    }
  }

  setVisible(visible) {
    this._componentVisible = visible == true;
    this._componentNode.style.display = this._componentVisible ? "block" : "none";
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

  stateChanged(state, value) {
    if (state == this.properties.states.visible) {
      this.setVisible(value);
    }
  }
}

