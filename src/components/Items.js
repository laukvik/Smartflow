import {PresentationComponent} from "../PresentationComponent";
import {Collection} from "../Collection";

/**
 *
 * @typedef {Object} ItemsProperties
 * @property {string} type - always Items
 * @property {string} items - the items
 * @property {string} itemKey - the itemKey
 * @property {string} itemLabel - the itemLabel
 * @property {string} filter - the filter
 * @property {string} sort - the sort
 *
 */


/**
 *
 */
export class Items extends PresentationComponent {

  /**
   * Constructor for Items
   *
   * @param {ItemsProperties} properties the properties for the component
   */
  constructor(properties) {
    super(properties);
    this.createComponentNode("div");
    this.collections = new Collection();
    this.layout = null;
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
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "layout") {
      this.setLayout(value);
    } else {
      //console.warn("Items: Invalid property ", name );
    }
  }

  setLayout(layout) {
    if (Array.isArray(layout)){
      this.layout = layout;
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

  setItemsWithLayout(items) {
    this.removeChildNodes(this._componentNode);

    // Layout
    const container = document.createElement("div");
    container.setAttribute("class", "container-fluid");
    this.getComponentNode().appendChild(container);
    let row = null;
    let column = null;

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

      // Layout
      if (n % this.layout.length === 0) {
        row = document.createElement("div");
        row.setAttribute("class", "row");
        container.appendChild(row);
      }

      column = document.createElement("div");
      column.setAttribute("class", "col-sm-" + this.layout[ n % this.layout.length ]);

      row.appendChild(column);

      this._builder.buildChildNode(column, component);
    }
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

