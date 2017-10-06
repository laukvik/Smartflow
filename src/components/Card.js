import {PresentationComponent} from "../component";
import {Collections} from "../collections";

/**
 * Card
 *
 * <div class="card" style="width: 20rem;">
 *     <img class="card-img-top" src="..." alt="Card image cap">
 *      <div class="card-block">
 *          <h4 class="card-title">Card title</h4>
 *          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
 *          <a href="#" class="btn btn-primary">Go somewhere</a>
 *      </div>
 * </div>
 */
export class Card extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this.collections = new Collections();
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

  setVisible(isVisible) {
    this._componentNode.style.display = isVisible === true ? "block" : "none";
  }

}
