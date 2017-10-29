import {PresentationComponent} from "../PresentationComponent";
import {Collection} from "../Collection";

class List extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this._items = [];
    this.collections = new Collection();
    this.createComponentNode("ul", "List");
    this._itemKey = "value";
    this._itemLabel = "text";
    this._itemBadge = "text";
  }

  setProperty(name, value) {
    if (name === "items") {
      this.setItems(value);
    } else if (name === "itemLabel") {
      this.setItemLabel(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    } else if (name === "paging") {
      this.setPaging(value);
    } else if (name === "itemBadge") {
      this.setItemBadge(value);
    }
  }

  _update() {
    this.setItems(this._items);
  }

  setItemBadge(itemBadge){
    this._itemBadge = itemBadge;
  }

  setItemLabel(itemLabel){
    this._itemLabel = itemLabel;
  }

  setSort(sort) {
    this.collections.setSort(sort);
    this._update();
  }

  setFilter(filter) {
    if (Array.isArray(filter)) {
      this.collections.setFilter(filter);
      this._update();
    } else {
      this.filter = [];
    }
  }

  setPaging(paging) {
    this.collections.setPaging(paging);
    this._update();
  }

  buildComponent(builder, properties){
    return this._componentNode;
  }

  isValid() {
    if (this.isRequired()) {
      return this.getSelected() !== undefined;
    }
    return true;
  }

  setItems(rowData) {
    this.removeChildNodes(this._componentNode);
    if (Array.isArray(rowData)) {
      this._componentNode.setAttribute("class" , "list-group");
      let items = this.collections.find(rowData);
      this._items = rowData;

      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let itemText = item[ this._itemLabel ];
        let itemBadge = item[ this._itemBadge ];

        let div = document.createElement("li");
        div.setAttribute("class", "list-group-item justify-content-between");

        let textNode = document.createTextNode(itemText);

        let badge = document.createElement("span");
        badge.setAttribute("class", "badge badge-default badge-pill");
        badge.innerText = itemBadge;

        div.appendChild(textNode);
        div.appendChild(badge);

        this._componentNode.appendChild(div);

      }
    }
  }
}

export {List}
