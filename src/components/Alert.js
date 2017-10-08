import {Component} from "../Component";

/**
 * Alert
 *
 */
export class Alert extends Component {

  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this._componentNode.setAttribute("role", "alert");
    this._buttonNode = document.createElement("button");
    this._buttonNode.setAttribute("type", "button");
    this._buttonNode.setAttribute("class", "close");
    this._buttonNode.setAttribute("data-dismiss", "alert");
    this._buttonNode.setAttribute("aria-label", "Close");
    this._buttonNode.addEventListener("click", function () {
      this.setVisible(false);
    }.bind(this), false);
    this._buttonSpanNode = document.createElement("span");
    this._buttonSpanNode.setAttribute("aria-hidden", "true");
    this._buttonSpanNode.innerHTML = "&times;";
    this._textNode = document.createElement("span");
    this._buttonNode.appendChild(this._buttonSpanNode);
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "text") {
      this.setText(value);
    } else if (name === "style") {
      this.setStyle(value);
    } else if (name === "visible") {
      this.setVisible(value);
    }
  }

  setStyle(style) {
    this._alertStyle = style;
    this._componentNode.setAttribute("class", "alert " + ("alert-" + this._alertStyle));
  }

  buildComponent(builder, properties) {
    if (properties.closable == true) {
      this._componentNode.appendChild(this._buttonNode);
    }
    this._componentNode.appendChild(this._textNode);
    return this._componentNode;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._componentNode.removeAttribute("disabled");
    } else {
      this._componentNode.setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this._textNode.innerHTML = text;
  }

}
