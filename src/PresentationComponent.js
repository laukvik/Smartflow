import {Component} from "./Component";

/**
 * Component for presentation
 *
 * @private
 */
export class PresentationComponent extends Component {

  constructor(properties) {
    super(properties);
    this.componentRootNode = document.createElement("div");
  }

  buildComponent() {
    let div = document.createElement("div");
    div.innerText = "[Smartflow:" + this.constructor.name + "]";
    return div;
  }
}
