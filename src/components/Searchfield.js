import {InputComponent} from "../component";
import {Collections} from "../collections";

export class Searchfield extends InputComponent {
  constructor(properties) {
    super(properties);
    this.rootNode = document.createElement("div");
    this.optionsNode = document.createElement("div");
    this.optionsNode.setAttribute("class", "sf-searchfield-options");
    this.collections = new Collections(properties);
    this.selectedIndex =  -1;
    this.optionsNodes = [];
    this.setDropdownVisible(false);
  }

  arrowUp(){
    if (this.selectedIndex > 0) {
      this.setSelectedIndex(this.selectedIndex - 1);
    }
  }

  arrowDown(){
    if (this.selectedIndex < this.max) {
      this.setSelectedIndex(this.selectedIndex + 1);
    }
  }

  select(){
    this.setDropdownVisible(false);
  }

  setSelectedIndex(index){
    if (this.selectedIndex >= 0) {
      this.optionsNodes[ this.selectedIndex ].setAttribute("class", "sf-searchfield-option");
    }
    if (index >=0 && index < this.max){
      this.selectedIndex = index;
      this.optionsNodes[ index ].setAttribute("class", "sf-searchfield-option sf-searchfield-option-selected");
    } else {
      this.selectedIndex = -1;
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
      //console.info("keyup: ", evt);
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
      this.rootNode.appendChild(addonBefore);
    }
    this.rootNode.appendChild(this.input);
    if (properties.icon_after) {
      let addonAfter = document.createElement("span");
      addonAfter.setAttribute("class", "input-group-addon");
      let iconAfter = document.createElement("span");
      iconAfter.setAttribute("class", "glyphicon " + properties.icon_after);
      addonAfter.appendChild(iconAfter);
      this.rootNode.appendChild(addonAfter);
    }
    if (properties.id){
      this.rootNode.setAttribute("id", properties.id);
    }
    this.rootNode.setAttribute("class", "sf-searchfield input-group" + (properties.class ? " " + properties.class : ""));
    this.rootNode.appendChild(this.optionsNode);
    return this.rootNode;
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

  setRows(rowData){
    this.removeChildNodes(this.optionsNode);
    if (Array.isArray(rowData)) {
      this.collections.setFilter([{
        "match": "title",
        "type": "contains",
        "value": this.getValue()
      }]);
      let items = this.collections.find(rowData);
      this.max = items.length;

      for (let x=0; x<items.length; x++) {
        let node = document.createElement("div");
        node.setAttribute("class", "sf-searchfield-option");



        this.optionsNodes.push(node);

        let item = items[ x ];
        node.innerText = item.title;
        this.optionsNode.appendChild(node);
      }
      this.setDropdownVisible(true);
    }
  }


  _changed(value) {
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
