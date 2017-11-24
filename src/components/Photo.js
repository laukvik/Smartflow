import {PresentationComponent} from "../PresentationComponent";

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
   */
  constructor() {
    super();
    this.createComponentNode("div");
    this._imgNode = document.createElement("img");
    this._componentNode.appendChild(this._imgNode);
    this._border = false;
    this._rounded = false;
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
    } else if (name === "border") {
      this.setBorder(value);
    } else if (name === "rounded") {
      this.setRounded(value);
    } else  {
      console.warn("Photo: Unknown property ", name);
    }
  }

  _updateClass(){
    this._imgNode.setAttribute("class", (this._border ? "img-thumbnail" : "") + (this._rounded ? " rounded" : ""));
  }

  setBorder(border) {
    this._border = border === true;
    this._updateClass();
  }

  setRounded(rounded) {
    this._rounded = rounded === true;
    this._updateClass();
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

}
