import {PresentationComponent} from "../Component";
import {Collections} from "../Collections";

export class Items extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this.collections = new Collections();
  }

  setProperty(name, value) {
    if (name === "items") {
      this.setItems(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    } else if (name === "paging") {
      this.setPaging(value);
    }
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

  setPaging(paging) {
    this.collections.setPaging(paging);
  }

  setItems(items) {
    this.removeChildNodes(this._componentNode);
    this._unfilteredItems = Array.isArray(items) ? items : [];
    // Filter
    this._items = this.collections.find(this._unfilteredItems);
    // For each
    for (let n = 0; n < this._items.length; n++) {
      let item = this._items[n];
      let component = {};
      //
      for (let componentKey in this._component) {
        let itemKey = item[ componentKey ]; // description
        let itemValue = this._component[ componentKey ];
        let value = item[ itemValue ];
        //console.info("key: ", componentKey, itemKey, itemValue, value );
        component[ componentKey ] = value;
      }
      // Don't interpret component type. It's always fixed.
      component.type = this._component.type;
      this._builder.buildChildNode(this._componentNode, component);
    }
  }

  buildComponent(builder, properties) {
    this._builder = builder;
    this._component = properties.component;
    return this._componentNode;
  }

}

