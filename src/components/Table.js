import {InputComponent} from "../InputComponent";
import {Collection} from "../Collection";
import {Photo} from "./Photo";
import {Scope, SCOPES} from "../Scope";
import {Builder} from "../Builder";

/**
 *
 * @typedef {Object} TableProperties
 * @property {string} type - always Table
 * @property {string} items - the items
 * @property {string} rowKey - the rowKey
 * @property {string} columns - the columns
 * @property {string} selected - the selected
 * @property {string} sort - the sort
 * @property {string} filter - the filter
 * @property {string} paging - the paging
 *
 */

/**
 *
 *
 *
 */
class Table extends InputComponent {

  /**
   * Constructor for Table
   *
   * @param {TableProperties} props the properties for the component
   */
  constructor() {
    super();
    this.collections = new Collection();
    this.selected = [];
    this.columns = [];
    this._items = [];
    this.inputNodes = [];
    this.createComponentNode("div");
    this.tableNode = document.createElement("table");
    this.tableNode.setAttribute("class", "table");
    this.headerNode = document.createElement("thead");
    this.bodyNode = document.createElement("tbody");
    this.footerNode = document.createElement("tfoot");
    this.tableNode.appendChild(this.headerNode);
    this.tableNode.appendChild(this.bodyNode);
    this.tableNode.appendChild(this.headerNode);
    this.tableNode.appendChild(this.footerNode);
    this._componentNode.appendChild(this.tableNode);
  }

  setProperty(name, value) {
    if (name === "items") {
      this.setItems(value);
    } else if (name === "rowKey") {
      this.setRowKey(value);
    } else if (name === "columns") {
      this.setColumns(value);
    } else if (name === "selected") {
      this.setSelected(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    } else if (name === "paging") {
      this.setPaging(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else {
      console.warn("Table: Unkown property ", name);
    }
  }

  buildComponent(builder, properties) {
    this.builder = builder;
    return this._componentNode;
  }

  setRowKey(rowKey) {
    this.rowKey = rowKey;
  }

  setSelected(selected) {
    if (Array.isArray(selected)) {
      this.selected = selected;
      for (let y = 0; y < this.inputNodes.length; y++) {
        let inputSelect = this.inputNodes[y];
        inputSelect.checked = this.selected.indexOf(inputSelect.getAttribute("id")) > -1;
      }
    } else {
      this.selected = [];
    }
  }

  getSelected() {
    return this.selected;
  }

  setColumns(columns) {
    if (Array.isArray(columns)) {
      this.columns = columns;
      this.removeChildNodes(this.headerNode);

      if (this.selectable) {
        let thSelectNode = document.createElement("th");
        this.headerNode.appendChild(thSelectNode);
      }

      for (let x = 0; x < columns.length; x++) {
        let column = columns[x];
        let thNode = document.createElement("th");
        thNode.innerText = column.label;
        this.headerNode.appendChild(thNode);
      }
    } else {
      this.columns = [];
    }
  }

  _update() {
    this.setItems(this._items);
  }

  setSelectable(selectable) {
    this.selectable = selectable == true;
    this.setColumns(this.columns);
    this._update();
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

  _changed(input) {
    let id = input.getAttribute("id");
    if (input.checked) {
      this.selected.push(id);
    } else {
      let index = this.selected.indexOf(id);
      this.selected.splice(index, 1);
    }
    this.fireComponentChanged("selected", this.getSelected());
  }

  setItems(rowData) {
    if (Array.isArray(rowData)) {
      let rows = this.collections.find(rowData);
      this._items = rows;
      this.removeChildNodes(this.bodyNode);
      for (let y = 0; y < rows.length; y++) {
        let row = rows[y];
        let trNode = document.createElement("tr");
        this.bodyNode.appendChild(trNode);

        if (this.selectable && this.rowKey !== undefined) {
          let thSelectNode = document.createElement("td");
          trNode.appendChild(thSelectNode);
          let inputSelect = document.createElement("input");
          let rowKey = row[this.rowKey];
          this.inputNodes.push(inputSelect);
          inputSelect.setAttribute("id", rowKey);
          inputSelect.setAttribute("type", "checkbox");
          inputSelect.checked = this.selected.indexOf(rowKey) > -1;
          thSelectNode.appendChild(inputSelect);
          inputSelect.addEventListener("click", function (evt) {
            this._changed(evt.srcElement);
          }.bind(this), false);
        }

        // Iterate through all columns
        for (let x = 0; x < this.columns.length; x++) {
          let column = this.columns[x];
          let tdNode = document.createElement("td");
          trNode.appendChild(tdNode);
          let cellData = row[column.key];
          if (column.component) {
            // Custom renderer
            let columnComponent = column.component;
            let copy = Object.assign( {}, columnComponent );
            for (let key in columnComponent) {
              if (key !== "type") {
                let s = Scope.parseScope(columnComponent[key]);
                if (s.scope === SCOPES.NONE){
                  copy[ key ] = s.value;

                } else if (s.scope === SCOPES.COMPONENT) {
                  copy[ key ] = row[ s.value ];
                }
              }
            }
            let c = Builder.buildComponentByProperties(copy, this.getView());
            tdNode.appendChild(c.getComponentNode());

            // this.builder.buildChildNode(tdNode, copy);
          } else if (column.format) {
            // Date format
            tdNode.innerText = this.builder.formatter.formatDate(cellData, column.format);
          } else {
            // Plain text
            tdNode.innerText = cellData;
          }
        }
      }
    }
  }

}

export {Table}
