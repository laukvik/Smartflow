import {PresentationComponent} from "../component";

export class Card extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.buttons = [];
    this.actions = [];
    this.components = [];
    this._componentNode = document.createElement("div");
    this._componentNode.setAttribute("class", "card");
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === "title") {
      this.setTitle(value);
    } else if (name === "description") {
      this.setDescription(value);
    }
  }

  setTitle(title) {
    this.titleNode.innerText = title;
  }

  setDescription(description) {
    this.descriptionNode.innerText = description;
  }

  buildComponent(builder, properties) {
    let cardImgTop = document.createElement("img");
    cardImgTop.setAttribute("class", "card-img-top");
    cardImgTop.setAttribute("src", properties.src);
    let cardBlock = document.createElement("div");
    cardBlock.setAttribute("class", "card-block");
    let cardTitle = document.createElement("h4");
    cardTitle.innerText = properties.title;
    cardTitle.setAttribute("class", "card-title");
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.innerText = properties.description;
    let a = document.createElement("button");
    a.setAttribute("class", "btn " + (properties.style ? " btn-" + properties.style : "btn-default"));
    a.innerText = properties.button;
    a.addEventListener("click", function () {
      this._clicked();
    }.bind(this), false);

    this._action = properties.action;
    this._componentNode.appendChild(cardImgTop);
    this._componentNode.appendChild(cardBlock);
    cardBlock.appendChild(cardTitle);
    cardBlock.appendChild(cardText);
    cardBlock.appendChild(a);

    this.titleNode = cardTitle;
    this.descriptionNode = cardText;

    return this._componentNode;
  }

  _clicked(){
    this.fireAction(this._action);
  }

  setVisible(isVisible) {
    this._componentNode.style.display = isVisible === true ? "block" : "none";
  }

}
