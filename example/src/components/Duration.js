/**
 * Duration
 *
 */
import {Component} from "../../../src/Component";


export class Duration extends Component {

  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
  }

  setProperty(name, value) {
    if (name === "value") {
      this.setValue(value);
    }
  }

  setValue(value) {
    this._componentNode.innerText = value == undefined ? "" : (value.substring(2, value.length-1) + " min");
  }

  buildComponent(builder, properties) {
    return this._componentNode;
  }

}
