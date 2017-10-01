import {PresentationComponent} from "../component";
import {Collections} from "../collections";

export class Card extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.collections = new Collections();
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

    } else if (name === "items") {
      this.setItems(value);

    } else if (name === "itemPhoto") {
      this.setItemPhoto(value);

    } else if (name === "itemTitle") {
      this.setItemTitle(value);

    } else if (name === "itemDescription") {
      this.setItemDescription(value);

    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    }
  }

  setItemTitle(itemTitle) {
    this._itemTitle = itemTitle;
  }

  setItemDescription(itemDescription) {
    this._itemDescription = itemDescription;
  }

  setItemPhoto(itemPhoto) {
    this._itemPhoto = itemPhoto;
  }

  setPaging(paging) {
    this.collections.setPaging(paging);
  }

  setSort(sort) {
    this.collections.setSort(sort);
  }

  setFilter(filter) {
    if (Array.isArray(filter)) {
      this.collections.setFilter(filter);
    } else {
      this.filter = [];
    }
  }

  setItems(rowData){
    this.removeChildNodes(this._componentNode);
    this.inputNodes = [];
    if (Array.isArray(rowData)) {
      let items = this.collections.find(rowData);
      this._items = rowData;

      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemTitle = item[ this._itemTitle ];
        let itemDesc = item[ this._itemDescription ];
        let itemButton = null;
        let itemSrc = item[ this._itemPhoto ];
        let itemAction = null;

        let node = this.buildCard(itemSrc, itemTitle, itemDesc, itemButton, itemAction );

        this._componentNode.appendChild(node);
      }
    }
  }

  buildCard(src, title, description, button, action) {
    let node = document.createElement("div");

    let cardImgTop = document.createElement("img");
    cardImgTop.setAttribute("class", "card-img-top");
    cardImgTop.setAttribute("src", src);
    let cardBlock = document.createElement("div");
    cardBlock.setAttribute("class", "card-block");
    let cardTitle = document.createElement("h4");
    cardTitle.innerText = title;
    cardTitle.setAttribute("class", "card-title");
    let cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    cardText.innerText = description;
    let a = document.createElement("button");
    a.setAttribute("class", "btn ");
    a.innerText = button;
    a.addEventListener("click", function () {
      this._clicked();
    }.bind(this), false);

    this._action = action;
    node.appendChild(cardImgTop);
    node.appendChild(cardBlock);
    cardBlock.appendChild(cardTitle);
    cardBlock.appendChild(cardText);
    //cardBlock.appendChild(a);

    this.titleNode = cardTitle;
    this.descriptionNode = cardText;

    return node;

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
