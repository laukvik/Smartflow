import {InputComponent} from "../InputComponent";
import {Collection} from "../Collection";

/**
 *
 * @typedef {Object} SearchfieldProperties
 * @property {string} type - always Textfield
 * @property {string} label - the label
 * @property {boolean} required - indicates whether the value is required
 * @property {string} value - the value of the Textfield
 * @property {string} placeholder - the placeholder for the Textfield
 * @property {string} enabled - the enabled
 * @property {string} help - the items
 * @property {string} items - the items
 * @property {string} itemKey - the property name to use as value
 * @property {string} itemLabel - the property name for displaying a label
 * @property {string} itemsEmpty - the text to show when collection is empty
 * @property {string} sort - the sort
 * @property {string} filter - the filter
 * @property {string} component - the component to render as an item
 * @property {string} selectAction - the action to run when an item is selected
 */

/**
 *
 *  Allows to search through items by display items that starts with the specified
 * value in the input field.
 *
 */
export class Searchfield extends InputComponent {

  /**
   * Constructor for Searchfield
   *
   * @param {SearchfieldProperties} properties the properties for the component
   */
  constructor() {
    super();
    this.getComponentNode().style.position = "relative";
    this.optionsNode = document.createElement("ul");
    this.optionsNode.setAttribute("class", "dropdown-menu");
    this.collections = new Collection();
    this.selectedIndex = -1;
    this.optionsNodes = [];
    this._unfilteredItems = [];
    this._items = [];
    this._itemKey = "title";
    this._itemLabel = "title";
    this._itemsEmpty = "No results";
    this._selected = undefined; // the selected value

    this._inputNode = document.createElement("input");
    this._inputNode.setAttribute("type", "search");
    this._inputNode.setAttribute("class", "form-control");
    this._inputNode.setAttribute("spellcheck", "false");
    this._inputNode.style.width = "100%";


    this._inputNode.addEventListener('keyup', function (evt) {
      this.setDropdownVisible(true);
      if (evt.key === "ArrowDown") {
        this.arrowDown();
      } else if (evt.key === "ArrowUp") {
        this.arrowUp();
      } else if (evt.key === "Enter") {
        this.select();
      } else {
        this._changed(evt.srcElement.value);
      }
    }.bind(this), false);

    this.updateInputGroup();
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "items") {
      this._unfilteredItems = value;
      this.setItems(value);
    } else if (name === "value") {
      this.setValue(value);
    } else if (name === "help") {
      this.setHelp(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    } else if (name === "itemKey") {
      this.setItemKey(value);
    } else if (name === "itemLabel") {
      this.setItemLabel(value);
    } else if (name === "itemsEmpty") {
      this.setItemsEmpty(value);
    } else if (name === "placeholder") {
      this.setPlaceholder(value);
    } else if (name === "selectAction") {
      this.setSelectAction(value);
    } else if (name === "selectedItem") {
      this.setSelected(value);
    } else if (name === "component") {
        this.setComponent(value);
    } else {
      console.debug("Searchfield: Unknown property ", name);
    }
  }

  updateInputGroup(){
    this.removeChildNodes(this.getInputGroup());
    this.getInputGroup().appendChild(this._inputNode);
    this.getComponentNode().appendChild(this.optionsNode);
  }

  setComponent(value){
    this._itemComponent = value;
  }

  setSelected(value){
    this._selected = value;
  }

  setSelectAction(action) {
    this.selectAction = action;
  }

  setItemsEmpty(itemsEmpty) {
    this._itemsEmpty = itemsEmpty;
  }

  setItemKey(itemKey) {
    this._itemKey = itemKey;
  }

  setItemLabel(itemLabel) {
    this._itemLabel = itemLabel;
  }

  setItems(rowData) {
    this.removeChildNodes(this.optionsNode);
    if (Array.isArray(rowData)) {
      this.optionsNodes = [];
      this.selectedIndex = 0;

      this.collections.clearFilter();
      this.collections.addStartsWith(this._itemKey, this.getValue());

      let items = this.collections.find(rowData);
      this._items = items;

      for (let x = 0; x < items.length; x++) {
        let item = items[x];
        let node;
        if (this._itemComponent === undefined) {
          node = document.createElement("a");
          node.setAttribute("class", "dropdown-item " + (this.selectedIndex === x ? "active" : ""));
          node.innerText = item[this._itemLabel];
        } else {
          let copy = Object.assign( {}, this._itemComponent );
          for (let key in this._itemComponent) {
            if (key !== "type") {
              copy[ key ] = item[  this._itemComponent[key] ];
            }
          }
          node = document.createElement("div");
          node.setAttribute("class", "dropdown-item");
          this._builder.buildChildNode(node, copy);
        }
        node.addEventListener("click", () => {
          this.setSelectedIndex(x);
          this.select();
        });
        this.optionsNodes.push(node);
        this.optionsNode.appendChild(node);
      }
      if (items.length === 0) {
        let node = document.createElement("small");
        node.setAttribute("class", "dropdown-item disabled");
        node.innerText = this._itemsEmpty;
        this.optionsNode.appendChild(node);
      }
    }
    this.setSelectedIndex(0);
  }

  arrowUp() {
    this.setSelectedIndex(this.selectedIndex - 1);
  }

  arrowDown() {
    this.setSelectedIndex(this.selectedIndex + 1);
  }

  select() {
    let selected = this._items[this.selectedIndex];

    this._inputNode.value = selected.title;
    this.setDropdownVisible(false);
    this._inputNode.select();
    this.firePropertyChanged("value", this._inputNode.value);

    this._selected = selected[ this._itemKey ];

    this.firePropertyChanged("selected", this._selected);
    if (this.selectAction !== undefined) {
      this.fireAction(this.selectAction);
    }
  }

  setSelectedIndex(index) {
    if (index > -1 && index < this._items.length) {
      this.optionsNodes[this.selectedIndex].setAttribute("class", "dropdown-item");
      this.selectedIndex = index;
      this.optionsNodes[index].setAttribute("class", "dropdown-item active");
    }
  }

  setDropdownVisible(visible) {
    this.dropdownVisible = visible === true;
    this.optionsNode.style.display = this.dropdownVisible ? "block" : "none";
    this.optionsNode.style.position = "absolute";
    this.optionsNode.style.top = "70px";
    this.optionsNode.style.float = "none";
    // this.optionsNode.style.transform = "translate3d(0px, 38px, 0px)";
  }

  isValid() {
    return true;
  }

  setRegex(regex) {
    if (regex === undefined) {
      this.regex = undefined;
    }
    this.regex = new RegExp(regex);
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._inputNode.removeAttribute("disabled");
    } else {
      this._inputNode.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this._inputNode.hasAttribute("disabled");
  }

  setPlaceholder(text) {
    this._inputNode.setAttribute("placeholder", text);
  }

  getPlaceholder() {
    return this._inputNode.getAttribute("placeholder");
  }

  setValue(text) {
    this._inputNode.value = text === undefined ? "" : text;
  }

  getValue() {
    let s = this._inputNode.value;
    return s === undefined ? '' : s;
  }

  _changed(value) {
    this.firePropertyChanged("value", value);
    if (this.action === undefined) {
      this.setItems(this._unfilteredItems);
    } else {
      this.fireAction(this.action);
    }
    this.setDropdownVisible(value !== "");

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


  _update() {
    this.setItems(this._items);
  }

}
