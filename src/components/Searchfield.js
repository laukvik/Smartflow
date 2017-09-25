import {InputComponent} from "../component";
import {Collections} from "../collections";

export class Searchfield extends InputComponent {
  constructor(properties) {
    super(properties);
    this._componentNode = document.createElement("div");
    this.optionsNode = document.createElement("ul");
    this.optionsNode.setAttribute("class", "dropdown-menu");
    this.collections = new Collections(properties);
    this.selectedIndex =  -1;
    this.optionsNodes = [];
    this.rows = [];
    this.matchKey = properties.key;
    this.presentationKey = properties.presentation;
    this.setDropdownVisible(false);
  }

  setProperties(properties){
    this.setLabel(properties.label);
    this.setRequired(properties.required);
  }

  setRows(rowData){
    this.removeChildNodes(this.optionsNode);
    if (Array.isArray(rowData)) {
      this.optionsNodes = [];
      this.selectedIndex = 0;
      this.setDropdownVisible(false);
      this.collections.setFilter([{
        "match": this.matchKey,
        "type": "startswith",
        "value": this.getValue()
      }]);
      this.collections.setSort({
        "match": this.matchKey,
        "order": "asc"
      });
      let items = this.collections.find(rowData);
      this.rows = items;
      for (let x=0; x<items.length; x++) {
        let item = items[ x ];
        let node = document.createElement("li");
        let a = document.createElement("a");
        a.innerText = item[ this.matchKey ];
        if (x === 0){
          node.setAttribute("class", "active");
        }
        node.appendChild(a);
        this.optionsNodes.push(node);
        this.optionsNode.appendChild(node);
      }
      if (items.length > 0){
        this.setDropdownVisible(true);
      }
    }
  }

  arrowUp(){
    this.setSelectedIndex(this.selectedIndex - 1);
  }

  arrowDown(){
    this.setSelectedIndex(this.selectedIndex + 1);
  }

  select(){
    this.input.value = this.rows[ this.selectedIndex ].title;
    this.setDropdownVisible(false);
    this.input.select();
  }

  setSelectedIndex(index){
    if (index > -1 && index < this.rows.length ){
      this.optionsNodes[ this.selectedIndex ].setAttribute("class", "");
      this.selectedIndex = index;
      this.optionsNodes[ index ].setAttribute("class", "active");
    }
  }

  setDropdownVisible(visible){
    this.dropdownVisible = visible === true;
    this.optionsNode.style.display = this.dropdownVisible ? "block" : "none";
  }

  buildComponent(builder, properties) {
    this.action = properties.action;
    this.input = document.createElement("input");
    this.input.setAttribute("type", "text");
    this.input.setAttribute("class", "form-control");

    this.input.setAttribute("placeholder", properties.placeholder);
    this.input.addEventListener('keyup', function (evt) {
      if (evt.key === "ArrowDown") {
        this.arrowDown();
      } else if (evt.key === "ArrowUp") {
        this.arrowUp();
      } else if (evt.key === "Enter"){
        this.select();
      } else {
        this._changed(evt.srcElement.value);
      }
    }.bind(this), false);
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    if (properties.validation){
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
    if (properties.id){
      this._componentNode.setAttribute("id", properties.id);
    }
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
    this.input.setAttribute("placeholder", text);
  }

  getPlaceholder() {
    return this.input.getAttribute("placeholder");
  }

  setValue(text) {
    this.input.value = text == undefined ? "" : text;
  }

  getValue() {
    let s = this.input.value;
    return s === undefined ? '' : s;
  }


  _changed(value) {
    if (value === "") {
      this.setDropdownVisible(false);
      return;
    }
    this.fireState(this.comp.states.value, value);
    //this.fireComponentChanged("value", value);
    this.fireAction(this.action);
  }

  stateChanged(state, value) {
    if (state == this.comp.states.value) {
      this.setValue(value);

    } else if (state == this.comp.states.rows) {
      this.setRows(value);

    } else if (state == this.comp.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.comp.states.label) {
      this.setLabel(value);
    } else if (state == this.comp.states.required) {
      this.setRequired(value);
    }
  }
}
