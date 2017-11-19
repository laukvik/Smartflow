import {PresentationComponent} from "../PresentationComponent";
import {Collection} from "../Collection";
import {Builder} from "../Builder";

/**
 *
 * @typedef {Object} CardProperties
 * @property {string} type - always Card
 * @property {title} title - the title
 * @property {description} description - the description
 * @property {photo} photo - the photo
 * @property {button} button - the button
 * @property {action} action - the action
 *
 */

/**
 * Card
 *
 *
 */
export class Card extends PresentationComponent {

  /**
   * Constructor for Card
   *
   * @param {CardProperties} props the properties for the component
   */
  constructor() {
    super();
    this.createComponentNode("div");
    this.getComponentNode().setAttribute("class", "card");
    this.collections = new Collection();
    this.buttons = [];
    this.actions = [];
    this.components = [];

    this.blockNode = document.createElement("div");
    this.blockNode.setAttribute("class", "card-block");

    this.photoNode = document.createElement("img");
    this.photoNode.setAttribute("class", "card-img-top");
    this.titleNode = document.createElement("h4");
    this.descriptionNode = document.createElement("p");
    this.descriptionNode.setAttribute("class", "card-text");

    this._componentNode.appendChild(this.photoNode);
    this._componentNode.appendChild(this.blockNode);
    this.blockNode.appendChild(this.titleNode);
    this.blockNode.appendChild(this.descriptionNode);
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === "title") {
      this.setTitle(value);
    } else if (name === "description") {
      this.setDescription(value);
    } else if (name === "photo") {
      this.setPhoto(value);
    } else if (name === "action") {
      this.setAction(value);
    } else if (name === "button") {
      console.info("Card.button undefined: ", value);
      if (!value){
        return;
      }
      this.setButton(value);
    } else {
      console.warn("Card: Unknown property ", name);
    }
  }

  setAction(action){
    this._action = action;
  }

  setButton(button){
    this.buttonInstance = Builder.buildComponentByProperties(button, this.getView());
    this.buttonNode = this.buttonInstance.getComponentNode();
    this.blockNode.appendChild(this.buttonNode);
  }

  setTitle(title) {
    this.titleNode.innerText = title;
  }

  setDescription(description) {
    this.descriptionNode.innerText = description;
  }

  setPhoto(url) {
    this.photoNode.src = url;
  }

}
