import {Component} from "../Component";

/**
 * Displays text
 *
 */
export class Text extends Component {

  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");

    this._headingNode = document.createElement("h1");
    this._textNode = document.createElement("p");

    this._componentNode.appendChild(this._headingNode);
    this._componentNode.appendChild(this._textNode);
  }

  setProperty(name, value) {
    if (name === "heading") {
      this.setHeading(value);
    } else if (name === "text") {
      this.setText(value);
    } else if (name === "visible") {
      this.setVisible(value);
    }
  }

  buildComponent(){
    return this._componentNode;
  }

  setHeading(heading) {
    this._headingNode.innerText = heading;
  }

  setText(text) {
    this._textNode.innerText = text;
  }

}
