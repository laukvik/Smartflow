import {PresentationComponent} from "../PresentationComponent";
import {Collection} from "../Collection";

/**
 *
 * @typedef {Object} PhotoProperties
 * @property {string} type - always Photo
 * @property {url} url - the url of the photo
 *
 */

/**
 * Card
 *
 *
 */
export class Photo extends PresentationComponent {

  /**
   * Constructor for Card
   *
   * @param {PhotoProperties} props the properties for the component
   */
  constructor(props) {
    super(props);
    this._componentNode = document.createElement("div");
    this._imgNode = document.createElement("img");
    this._componentNode.appendChild(this._imgNode);
  }

  setProperty(name, value) {
    if (name === "url") {
      this.setUrl(value);
    } else if (name === "width") {
      this.setWidth(value);
    } else if (name === "height") {
      this.setHeight(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else  {
      console.warn("Photo: Unknown property ", name);
    }
  }

  setWidth(value) {
    this._imgNode.setAttribute("width", value);
  }

  setHeight(value) {
    this._imgNode.setAttribute("height", value);
  }

  setUrl(url) {
    this._imgNode.setAttribute("src", url);
  }

  buildComponent(builder, properties) {
    return this._componentNode;
  }

}
