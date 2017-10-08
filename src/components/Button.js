import {Component} from "../Component";

class Button extends Component {

  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("button");
    this._textNode = document.createTextNode("");
    this._badgeNode = document.createElement("span");
    this._badgeNode.setAttribute("class", "badge");
    this._componentNode.appendChild(this._textNode);
    this._componentNode.appendChild(this._badgeNode);
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "style") {
      this.setStyle(value);
    } else if (name === "badge") {
      this.setBadge(value);
    } else if (name === "action") {
      this.action = value;
    }
  }

  setLabel(text) {
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


}

export {Button}
