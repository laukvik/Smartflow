import {PresentationComponent} from "../component";
import {Collections} from "../collections";

export class Items extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this.collections = new Collections();
  }

  setProperty(name, value, path) {
    console.info("Items.setProperty: ", name, value, path);
    if (name === "items") {
      this.setItems(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filters") {
      this.setFilters(value);
    } else if (name === "paging") {
      this.setPaging(value);
    } else if (name === "filter") {
      this.collections.clearFilter();
      if (value !== undefined) {
        this.collections.addContains("title", value);
      }
      this.setItems(this._unfilteredItems);
    }
  }

  setSort(sort) {
    this.collections.setSort(sort);
  }

  setFilter(filter) {
    console.info("Items.setFilter: ", filter);
    this.collections.setFilter(filter);
  }

  setFilters(filter) {
    console.info("Items.setFilters: ", filter);
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
    console.info("Items.setItems: ", items);
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
        let itemValue = this._component[ componentKey ];
        let value = item[ itemValue ];
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

