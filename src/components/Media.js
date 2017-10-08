import {PresentationComponent} from "../Component";
import {Collections} from "../Collections";

export class Media extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.collections = new Collections();
    this.buttons = [];
    this.actions = [];
    this.components = [];
    this._componentNode = document.createElement("div");
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
        let itemSrc = item[ this._itemPhoto ];
        let itemTitle = item[ this._itemTitle ];
        let itemDesc = item[ this._itemDescription ];
        let itemButton = null;
        let itemAction = null;

        let node = this.buildMedia(itemSrc, itemTitle, itemDesc, itemButton, itemAction );

        this._componentNode.appendChild(node);
      }
    }
  }

  buildMedia(src, title, description, button, action) {
    let media = document.createElement("div");
    media.setAttribute("class", "media");
    let mediaObject = document.createElement("img");
    mediaObject.setAttribute("class", "d-flex mr-3");
    if (src !== undefined){
      mediaObject.setAttribute("src", src);
    }
    let mediaBody = document.createElement("div");
    mediaBody.setAttribute("class", "media-body");
    let mediaHeading = document.createElement("h5");
    mediaHeading.innerText = title;
    mediaHeading.setAttribute("class", "mt-0");
    let cardText = document.createElement("p");
    cardText.innerText = description;
    media.appendChild(mediaObject);
    media.appendChild(mediaBody);
    mediaBody.appendChild(mediaHeading);
    mediaBody.appendChild(cardText);
    return media;
  }

  setTitle(title) {
    this.titleNode.innerText = title;
  }

  setDescription(description) {
    this.descriptionNode.innerText = description;
  }

  buildComponent(builder, properties) {
    this._componentNode.setAttribute("class", "");
    return this._componentNode;
  }

  setVisible(isVisible) {
    this._componentNode.style.display = isVisible === true ? "block" : "none";
  }

}
