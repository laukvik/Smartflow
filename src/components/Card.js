import {PresentationComponent} from "../PresentationComponent";
import {Collection} from "../Collection";

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
  constructor(props) {
    super(props);
    this._componentNode = document.createElement("div");
    this._componentNode.setAttribute("class", "Card");
    this.collections = new Collection();
    this.buttons = [];
    this.actions = [];
    this.components = [];
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
      //this.setAction(value);
    } else if (name === "button") {
      //this.setButton(value);
    } else {
      console.warn("Card: Unknown property ", name);
    }
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

  buildComponent(builder, properties) {
    let cardImgTop = document.createElement("img");
    cardImgTop.setAttribute("class", "card-img-top");
    let cardBlock = document.createElement("div");
    cardBlock.setAttribute("class", "card-block");
    let cardTitle = document.createElement("h4");
    //cardTitle.innerText = properties.title;
    cardTitle.setAttribute("class", "card-title");
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    //cardText.innerText = properties.description;
    let a = document.createElement("button");
    a.setAttribute("class", "btn " + (properties.style ? " btn-" + properties.style : "btn-default"));
    //a.innerText = properties.button;
    a.addEventListener("click", function () {
      this._clicked();
    }.bind(this), false);

    this._action = properties.action;
    this._componentNode.appendChild(cardImgTop);
    this._componentNode.appendChild(cardBlock);
    cardBlock.appendChild(cardTitle);
    cardBlock.appendChild(cardText);
    //cardBlock.appendChild(a);

    this.titleNode = cardTitle;
    this.descriptionNode = cardText;
    this.photoNode = cardImgTop;

    return this._componentNode;
  }

  _clicked(){
    this.fireAction(this._action);
  }

}
