import {InputComponent} from "../component";


/**
 * Toolbar
 *
 * Properties:
 * - visible
 * - enabled
 */
export class Toolbar extends InputComponent {
  constructor(properties) {
    super(properties);
    this.buttons = [];
    this.actions = [];
  }

  buildComponent(builder, properties){
    let toolbarNode = document.createElement("div");
    if (properties.id){
      toolbarNode.setAttribute("id", properties.id);
    }
    toolbarNode.setAttribute("role", "toolbar");
    let groupNode = document.createElement("div");
    groupNode.setAttribute("class", "btn-group");
    toolbarNode.appendChild(groupNode);
    if (Array.isArray(properties.actions)) {
      for (let x=0; x<properties.actions.length; x++) {
        let component = properties.actions[ x ];
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-default");
        btn.innerText = component.label;
        groupNode.appendChild(btn);
        this.buttons.push(btn);
        btn.addEventListener("click", function () {
          this._clicked(component.action);
        }.bind(this), false);
      }
    }
    this.toolbarNode = toolbarNode;
    toolbarNode.setAttribute("class", "sf-toolbar btn-toolbar" + (properties.class ? " " + properties.class : ""));
    return toolbarNode;
  }

  _clicked(action){
    this.fireAction(action);
  }

  stateChanged(state, value) {
    if (state == this.properties.states.visible) {

    } else if (state == this.properties.states.enabled) {

    }
  }
}

