import {SmartflowComponent} from "../component";


class Button extends SmartflowComponent {

  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("button");
    this._textNode = document.createTextNode("");

    this._badgeNode = document.createElement("span");
    this._badgeNode.setAttribute("class", "badge");

    this._componentNode.appendChild(this._textNode);
    this._componentNode.appendChild(this._badgeNode);
  }

  setProperties(properties) {
    this.setText(properties.label);
    this.action = properties.action;
    this.setEnabled(properties.enabled);
    this.setStyle(properties.style);
    this.setBadge(properties.badge);
  }

  setText(text) {
    this._textNode.nodeValue =  text;
  }

  setBadge(badge){
    this._badgeNode.innerText = badge;
  }

  /**
   * Sets the style of button. Valid styles are:
   *
   * - primary
   * - secondary
   * - success
   * - info
   * - warning
   * - danger
   * - link
   *
   */
  setStyle(style){
    this._buttonStyle = style;
    this._componentNode.setAttribute("class", "btn " + ("btn-"+this._buttonStyle) );
  }

  buildComponent(builder, properties) {
    this._componentNode.setAttribute("class", "btn " + ("btn-"+this._buttonStyle)  + + (properties.class ? " " + properties.class : ""));
    this._componentNode.addEventListener("click", function () {
      this._clicked(properties);
    }.bind(this), false);
    return this._componentNode;
  }

  _clicked(action) {
    this.fireAction(action.action);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._componentNode.removeAttribute("disabled");
    } else {
      this._componentNode.setAttribute("disabled", "true");
    }
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

export {Button}
