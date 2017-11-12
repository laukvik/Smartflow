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
    this.createComponentNode("div");
    this.getComponentNode().setAttribute("class", "card");
    this.collections = new Collection();
    this.buttons = [];
    this.actions = [];
    this.components = [];

    this.blockNode = document.createElement("div");
    this.blockNode.setAttribute("class", "card-block");

    this.buttonNode = document.createElement("a");
    this.buttonNode.setAttribute("class", "btn btn-primary");
    this.photoNode = document.createElement("img");
    this.photoNode.setAttribute("class", "card-img-top");
    this.titleNode = document.createElement("h4");
    this.descriptionNode = document.createElement("p");
    this.descriptionNode.setAttribute("class", "card-text");

    this._componentNode.appendChild(this.photoNode);
    this._componentNode.appendChild(this.blockNode);
    this.blockNode.appendChild(this.titleNode);
    this.blockNode.appendChild(this.descriptionNode);
    this.blockNode.appendChild(this.buttonNode);

    this.buttonNode.addEventListener("click", function () {
      this._clicked();
    }.bind(this), false);
  }

  /**
   <div class="card" style="width: 20rem;">
       <img class="card-img-top" src="..." alt="Card image cap">
       <div class="card-block">
         <h4 class="card-title">Card title</h4>
         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
         <a href="#" class="btn btn-primary">Go somewhere</a>
       </div>
   </div>

   * @param name
   * @param value
   */

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
      this.setButton(value);
    } else {
      console.warn("Card: Unknown property ", name);
    }
  }

  setAction(action){
    this._action = action;
  }

  setButton(button){
    this.buttonNode = button;
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


    return this._componentNode;
  }

  _clicked(){
    this.fireAction(this._action);
  }

}
