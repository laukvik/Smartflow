import {Component} from "../Component";

export const TextColor = {
  PRIMARY: "text-primary",
  SECONDARY: "text-secondary",
  SUCCESS: "text-success",
  DANGER: "text-danger",
  WARNING: "text-warning",
  INFO: "text-info",
  LIGHT: "text-light",
  DARK: "text-dark",
  MUTED: "text-muted",
  WHITE: "text-white"
};

/**
 * Displays text
 *
 */
export class Text extends Component {

  constructor() {
    super();
    this.createComponentNode("div");
    this._textNode = document.createElement("p");
    this._componentNode.appendChild(this._textNode);
  }

  setProperty(name, value) {
    if (name === "value") {
      this.setText(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "color") {
      this.setColor(value);
    } else {
      console.warn("Text: Unknown property ", name);
    }
  }

  setColor(color){
    this._textNode.setAttribute("class", color);
  }

  setText(text) {
    this._textNode.innerText = text;
  }

}
