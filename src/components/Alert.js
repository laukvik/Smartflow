import {Component} from "../Component";

/**
 *
 *
 *
 * @typedef {Object} AlertProperties
 * @property {text} text - the message
 * @property {style} style - the style of alert (info, success, warning, error)
 * @property {visible} components - an array of components
 *
 */

export const AlertStyle = {
  PRIMARY: "alert-primary",
  SECONDARY: "alert-secondary",
  SUCCESS: "alert-success",
  DANGER: "alert-danger",
  WARNING: "alert-warning",
  INFO: "alert-info"
};

/**
 * Alert
 *
 * https://getbootstrap.com/docs/4.0/components/alerts/
 *
 * @example
 *
 * {
 * "type": Alert,
 * "text": "Document saved.",
 * "style": AlertStyle.SUCCESS
 * }
 *
 */
export class Alert extends Component {

  /**
   * Constructor for Alert
   *
   * @param {AlertProperties} properties the properties for the component
   */
  constructor(properties) {
    super(properties);
    this._closable = false;
    this.createComponentNode("div");
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
    this._buttonNode.appendChild(this._buttonSpanNode);

    this._textNode = document.createElement("span");
    this.getComponentNode().appendChild(this._textNode);
  }

  setProperty(name, value) {
    if (name === "text") {
      this.setText(value);
    } else if (name === "alertStyle") {
      this.setAlertStyle(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "closable") {
      this.setClosable(value);
    }
  }

  _updateClass(){
    this._componentNode.setAttribute("class", "alert" + (!this._alertStyle ? "" : " " + this._alertStyle) + (!this._closable ? "" : " alert-dismissible"));
  }

  setClosable(isClosable){
    this._closable = isClosable === true;
    this._updateClass();
    if (this._closable){
      this._componentNode.appendChild(this._buttonNode);
    }
  }

  setAlertStyle(style) {
    this._alertStyle = style;
    this._updateClass();
  }

  buildComponent(builder, properties) {
    return this._componentNode;
  }

  setText(text) {
    this._textNode.textContent = text;
  }

  render(){
    return this.getComponentNode();
  }

}
