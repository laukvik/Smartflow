import {Component} from "../Component";

/**
 *
 * @typedef {Object} LinkProperties
 * @property {label} label - the label
 * @property {url} url - the url
 *
 */

/**
 * Link
 *
 */
export class Link extends Component {

  /**
   * Constructor for Link
   *
   * @param {LinkProperties} properties the properties for the component
   */
  constructor() {
    super();
    this.createComponentNode("div");
    this._aNode = document.createElement("a");
    this._componentNode.appendChild(this._aNode);
  }

  setProperty(name, value) {
    if (name === "url") {
      this.setUrl(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "tooltips") {
      this.setTooltips(value);
    } else {
      console.warn("Link: Unknown property ", name);
    }
  }

  setTooltips(text) {
    this._aNode.setAttribute("title", text);
  }

  setLabel(label) {
    this._aNode.innerText = label;
  }

  setUrl(url) {
    this._aNode.setAttribute("href", url);
  }

}
