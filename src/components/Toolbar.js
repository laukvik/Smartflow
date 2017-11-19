import {InputComponent} from "../InputComponent";
import {Builder} from "../Builder";

export class Toolbar extends InputComponent {

  constructor() {
    super();
    this.buttons = [];
    this.createComponentNode("div");
    this.getComponentNode().setAttribute("role", "toolbar");
    this._groupNode = document.createElement("div");
    this._groupNode.setAttribute("class", "btn-group");
    this.getComponentNode().appendChild(this._groupNode);
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === "buttons"){
      this.setButtons(value);
    } else {
      console.warn("Toolbar: Unknown property ", name);
    }
  }

  setButtons(buttons){
    this.buttons = Builder.buildComponentsByProperties(buttons, this.getView());
    this.removeChildNodes(this._groupNode);
    this.buttons.forEach( b => {
      this._groupNode.appendChild(b.getComponentNode());
    });
  }

  buildComponent(builder, properties) {
    return this.getComponentNode();
  }

}

