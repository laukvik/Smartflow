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
 */

/**
 * Searchfield
 *
 */
export class Searchfield extends InputComponent {

  /**
   * Constructor for Searchfield
   *
   * @param {SearchfieldProperties} props the properties for the component
   */
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
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
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "items") {
      console.info("Searchfield: items: ", value);
      this._unfilteredItems = value;
      this.setItems(value);
    } else if (name === "value") {
      this.setValue(value);
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
    } else if (name === "help") {
      this.setHelp(value);
    }
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
        let node = document.createElement("a");
        node.setAttribute("class", "dropdown-item " + (this.selectedIndex === x ? "active" : ""));
        node.innerText = item[this._itemLabel];
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
  }

  arrowUp() {
    this.setSelectedIndex(this.selectedIndex - 1);
  }

  arrowDown() {
    this.setSelectedIndex(this.selectedIndex + 1);
  }

  select() {
    this.input.value = this._items[this.selectedIndex].title;
    this.setDropdownVisible(false);
    this.input.select();
    this.firePropertyChanged("selected", this.input.value);
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
  }

  buildComponent(builder, properties) {
    this.action = properties.action;
    this.input = document.createElement("input");
    this.input.setAttribute("type", "text");
    this.input.setAttribute("class", "form-control");


    this.input.addEventListener('keyup', function (evt) {
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
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation) {
      this.setValidationMessage(properties.validation.message);
      this.setRegex(properties.validation.regex);
    }
    if (properties.icon_before) {
      let addonBefore = document.createElement("span");
      addonBefore.setAttribute("class", "input-group-addon");
      let iconBefore = document.createElement("span");
      iconBefore.setAttribute("class", "glyphicon " + properties.icon_before);
      addonBefore.appendChild(iconBefore);
      this._componentNode.appendChild(addonBefore);
    }
    this._componentNode.appendChild(this.input);
    if (properties.icon_after) {
      let addonAfter = document.createElement("span");
      addonAfter.setAttribute("class", "input-group-addon");
      let iconAfter = document.createElement("span");
      iconAfter.setAttribute("class", "glyphicon " + properties.icon_after);
      addonAfter.appendChild(iconAfter);
      this._componentNode.appendChild(addonAfter);
    }
    // if (properties.id){
    //   this._componentNode.setAttribute("id", properties.id);
    // }
    this._componentNode.setAttribute("class", "sf-searchfield input-group" + (properties.class ? " " + properties.class : ""));
    this._componentNode.appendChild(this.optionsNode);
    return this._componentNode;
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
      this.input.removeAttribute("disabled");
    } else {
      this.input.setAttribute("disabled", "true");
    }
  }

  isEnabled() {
    return !this.input.hasAttribute("disabled");
  }

  setPlaceholder(text) {
    this.input.setAttribute("placeholder", text === undefined ? "" : text);
  }

  getPlaceholder() {
    return this.input.getAttribute("placeholder");
  }

  setValue(text) {
    this.input.value = text === undefined ? "" : text;
  }

  getValue() {
    let s = this.input.value;
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
