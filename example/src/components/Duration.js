/**
 * Duration
 *
 */
import {Component} from "../../../src/Component";


export class Duration extends Component {

  constructor() {
    super();
    this._componentNode = document.createElement("div");
  }

  setProperty(name, value) {
    if (name === "value") {
      this.setValue(value);
    }
  }

  setValue(value) {
    this._componentNode.innerText = value === undefined ? "" : (value.substring(2, value.length-1) + " min");
  }


}
