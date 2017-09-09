class SmartflowComponent{
  constructor(comp, ctrl, builder){
    this.comp = comp;
    this.setView(ctrl);
    this.builder = builder;
  }
  setView(viewController){
    this.ctrl = viewController;
  }
  getView(){
    return this.ctrl;
  }
  setSmartflow(smartflow){
    this.smartflow = smartflow;
  }
  setElement( node ){
    this.rootNode = node;
  }
  getElement(){
    return this.rootNode;
  }
  setID(id){
    this.rootNode.setAttribute("id", id);
  }
  getID(){
    return this.rootNode.getAttribute("id");
  }
  setLabel(text){
    this.label.innerText = text;
  }
  getLabel(){
    return this.label.innerText;
  }
  buildRoot(name){
    this.setElement(document.createElement("div"));
    this.rootNode.setAttribute("class", name);
  }
  buildRootWithLabel(name, required){
    this.buildRoot(name);
    // label
    var label = document.createElement("div");
    this.label = label;
    label.setAttribute("class", "sf-label" + (required ? " sf-required" : ""));
    label.innerText = this.comp.label;
    this.rootNode.appendChild(label);
  }
  fireComponentChanged(property, value){
    this.smartflow.fireComponentChanged(this, property, value, this.ctrl);
  }
  fireAction(action){
    var func = eval(action);
    this.smartflow.runAction( new func(), this.getView());
  }
  setReqiured(isRequired){
    this.label.setAttribute("class", "sf-label" + (isRequired ? " sf-required" : ""));
  }
}

class Checkbox extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-checkbox", comp.required);
    this.optionsNode = document.createElement("div");
    this.setOptions(comp.options);
  }
  setVertical(isVertical){
    this.vertical = isVertical;
    this.getElement().setAttribute("class", "sf-checkbox " + (isVertical ? "sf-checkbox-vertical" : "sf-checkbox-horisontal") );
  }
  isVertical(){
    return this.vertical;
  }
  setOptions(items){
    if (Array.isArray(items)) {
      this.inputs = [];
      this.optionsNode.innerHTML = "";
      for (var x=0; x<items.length; x++) {
        var item = items[ x ];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-checkbox-option");
        this.rootNode.appendChild(span);
        var input = document.createElement("input");
        this.inputs.push(input);
        span.appendChild(input);
        input.setAttribute("type", "checkbox");
        input.setAttribute("value", itemValue);
        var text = document.createElement("span");
        span.appendChild(text);
        text.setAttribute("class", "sf-checkbox-option-label");
        text.innerText = itemText;
        var self = this;
        var inputs = this.inputs;
        input.addEventListener("change", function (evt) {
          self.fireComponentChanged("selection", {
            "value": evt.srcElement.value,
            "selected": inputs.filter(function(inp){ return inp.checked}).map(function(inp, index){
              return index;
            })
          });
        });
      }
    } else {
      console.warn("Checkbox: Not an array: ", items)
    }
  }
  stateChanged(stateEvent){
  }
}

class Radio extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-radio", comp.required);
    this.optionsNode = document.createElement("div");
    this.setOptions(comp.options);
    //this.setVertical(comp.vertical);
  }
  setVertical(isVertical){
    this.vertical = isVertical;
    this.getElement().setAttribute("class", "sf-radio " + (isVertical ? "sf-radio-vertical" : "sf-radio-horisontal") );
  }
  isVertical(){
    return this.vertical;
  }
  setOptions(items) {
    if (Array.isArray(items)) {
      this.inputs = [];
      this.optionsNode.innerHTML = "";
      var gui = "sf-radio-" + Math.round(100000);
      for (var x=0; x<items.length; x++) {
        var item = items[ x ];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-radio-option");
        this.getElement().appendChild(span);
        var input = document.createElement("input");
        span.appendChild(input);
        input.setAttribute("type", "radio");
        input.setAttribute("value", itemValue);
        input.setAttribute("name", gui);
        var text = document.createElement("span");
        span.appendChild(text);
        text.setAttribute("class", "sf-radio-option-label");
        text.innerText = itemText;

        var inputs = this.inputs;
        var self = this;
        input.addEventListener("change", function (evt) {
          self.fireComponentChanged("selection", {
            "value": evt.srcElement.value,
            "selected": inputs.filter(function(inp){ return inp.checked}).map(function(inp, index){
              return index;
            })
          });
        });
      }
    } else {
      console.warn("Radio.setOptions: ", items);
    }
  }
  stateChanged(stateEvent){
  }
}

class Pulldown extends SmartflowComponent {
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-pulldown", comp.required);

    this.select = document.createElement("select");
    this.select.setAttribute("class", "sf-pulldown-select");
    this.rootNode.appendChild(this.select);

    var self = this;
    this.select.addEventListener("change", function (evt) {
      self.fireComponentChanged("selection", {
        "value": evt.srcElement.value,
        "selected": evt.srcElement.selectedIndex
      });
    });

    this.setOptions(comp.options);
  }
  setOptions(items){
    while (this.select.firstChild) {
      this.select.removeChild(this.select.firstChild);
    }
    var optionEmpty = document.createElement("option");
    optionEmpty.value = "";
    this.select.appendChild(optionEmpty);

    for (var x=0; x<items.length; x++) {
      var item = items[ x ];
      var itemText = item.text;
      var itemValue = item.value;
      var option = document.createElement("option");
      this.select.appendChild(option);
      option.setAttribute("value", itemValue);
      option.innerText = itemText;
    }
  }
  stateChanged(stateEvent){
  }
}

class Textfield extends SmartflowComponent {
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    this.buildRootWithLabel("sf-textfield", comp.required);
    this.inputType = comp.rows ? 1 : 0;
    if (comp.rows){
      this.input = document.createElement("textarea");
      this.input.setAttribute("rows", comp.rows);
      this.input.setAttribute("class", "sf-textfield-input");
    } else {
      this.input = document.createElement("input");
      this.input.setAttribute("type", "text");
      this.input.setAttribute("class", "sf-textfield-input");
    }
    this.input.setAttribute("placeholder", comp.placeholder);
    this.rootNode.appendChild(this.input);
    var self = this;
    this.input.addEventListener("keyup", function (scope) {
      self.fireComponentChanged("value", self.input.value);
    });
  }
  setEnabled(isEnabled){
    if (isEnabled) {
      this.input.removeAttribute("disabled");
    } else {
      this.input.setAttribute("disabled", "true");
    }
  }
  isEnabled(){
    return this.getElement().hasAttribute("disabled");
  }
  setPlaceholder(text){
    this.input.setAttribute("placeholder", text);
  }
  getPlaceholder(){
    return this.input.getAttribute("placeholder");
  }
  setText(text){
    this.input.value = text;
  }
  getText(){
    return this.input.value;
  }
  stateChanged(stateEvent){
  }
}

class Button extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    var buttonNode = document.createElement("button");
    buttonNode.setAttribute("id", comp.id);
    buttonNode.setAttribute("class", "sf-button");
    this.action = comp.action;
    this.setElement(buttonNode);
    this.setText(comp.label);
    var self = this;
    buttonNode.addEventListener("click", function () {
      self.fireAction(self.action);
    });
  }
  setEnabled(isEnabled){
    if (isEnabled) {
      this.getElement().removeAttribute("disabled");
    } else {
      this.getElement().setAttribute("disabled", "true");
    }
  }
  setText(text) {
    this.getElement().innerText = text;
  }
  getText(){
    return this.getElement().innerText;
  }
  stateChanged(stateEvent){
    console.info("Button.stateChanged: ", stateEvent);
  }
}



class Label extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super();
    this.rootNode = document.createElement("label");
    this.rootNode.setAttribute("id", comp.id);
    this.rootNode.setAttribute("class", "sf-label" + (comp.required == true ? " sf-required" : ""));
    this.setText(comp.label);
  }
  setText(text){
    this.rootNode.innerText = text;
  }
  getText(){
    return this.rootNode.innerText;
  }
  stateChanged(stateEvent){
    console.info("Label.stateChanged: ", stateEvent);
  }
}





class Layout extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRoot("container");
    this.rows = document.createElement("div");
    this.getElement().appendChild(this.rows);
    this.rows.setAttribute("class", "row");

    if (Array.isArray(comp.components)) {
      for (var x=0; x<comp.components.length; x++) {
        var c = comp.components[ x ];
        // Grid

        var colsXS = c["col-xs"] === undefined ? "" : " col-xs-" + c["col-xs"];
        var colsSM = c["col-sm"] === undefined ? "" : " col-sm-" + c["col-sm"];
        var colsMD = c["col-md"] === undefined ? "" : " col-md-" + c["col-md"];
        var colsLG = c["col-lg"] === undefined ? "" : " col-lg-" + c["col-lg"];
        var colsXL = c["col-xl"] === undefined ? "" : " col-xl-" + c["col-xl"];

        var gridClass = (colsXS + colsSM + colsMD + colsLG + colsXL);

        var layoutCell = document.createElement("div");
        layoutCell.setAttribute("class", gridClass);
        this.rows.appendChild(layoutCell);
        // Component
        builder.buildChildNode(layoutCell, c);
      }
    }
  }
}









class Card extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    var rootNode = document.createElement("div");
    rootNode.setAttribute("class", "mdc-card");
    this.setElement(rootNode);

    var headerNode = document.createElement("section");
    headerNode.setAttribute("class", "mdc-card__primary");

    var h1Node = document.createElement("h1");
    h1Node.setAttribute("class", "mdc-card__title mdc-card__title--large");
    h1Node.innerText = comp.title;

    var h2Node = document.createElement("h2");
    h2Node.setAttribute("class", "mdc-card__subtitle");
    h2Node.innerText = comp.subtitle;

    var textNode = document.createElement("section");
    textNode.setAttribute("class", "mdc-card__supporting-text");

    var bodyNode = document.createElement("section");

    builder._buildChildNodes(bodyNode, comp.components);

    var footerNode = document.createElement("section");
    footerNode.setAttribute("class", "mdc-card__actions");

    if (Array.isArray(comp.actions)) {
      builder._buildChildNodes(footerNode, comp.actions);
    }


    rootNode.appendChild(headerNode);
    headerNode.appendChild(h1Node);
    headerNode.appendChild(h2Node);
    rootNode.appendChild(bodyNode);
    rootNode.appendChild(footerNode);

    this.rootNode = rootNode;
  }
  getNode(){
    return this.rootNode;
  }
  stateChanged(stateEvent){
    console.info("Card.stateChanged: ", stateEvent);
  }
}

class Dialog {
  constructor(comp, ctrl, builder){
    var rootNode = document.createElement("aside");
    rootNode.setAttribute("id", comp.id);
    rootNode.setAttribute("class", "mdc-dialog mdc-dialog--open");
    rootNode.setAttribute("role", "alertdialog");

    var surfaceNode = document.createElement("div");
    surfaceNode.setAttribute("class", "mdc-dialog__surface");

    var headerNode = document.createElement("header");

    headerNode.setAttribute("class", "mdc-dialog__header");

    var titleNode = document.createElement("h2");

    titleNode.setAttribute("class", "dialog__header__title");
    titleNode.innerText = comp.title;


    var backdropNode = document.createElement("div");
    backdropNode.setAttribute("class", "mdc-dialog__backdrop");

    var bodyNode = document.createElement("section");
    bodyNode.setAttribute("class", "mdc-dialog__body");

    var footerNode = document.createElement("section");
    footerNode.setAttribute("class", "mdc-dialog__footer");

    builder._buildChildNodes(footerNode, comp.actions);

    rootNode.appendChild(surfaceNode);
    surfaceNode.appendChild(headerNode);
    surfaceNode.appendChild(bodyNode);
    surfaceNode.appendChild(footerNode);
    headerNode.appendChild(titleNode);
    rootNode.appendChild(backdropNode);

    this.rootNode = rootNode;
  }
  getNode(){
    return this.rootNode;
  }
  stateChanged(stateEvent){
    console.info("Dialog.stateChanged: ", stateEvent);
  }
}




/**
 * Table
 *
 * - columns
 * - rows
 * - selection
 * - selectAll, selectNone
 * - paging: index, size
 *
 * - prevPage, nextPage
 *
 */
class Table {
  constructor(comp, ctrl, builder){
    this.comp  = comp;
    this.ctrl = ctrl;
    this.builder = builder;
    this.collections = new Collections(comp);
    var rootNode = document.createElement("table");
    rootNode.setAttribute("border", "1");
    rootNode.setAttribute("class", "mdc-table");
    var columns = comp.columns;
    this.headNode = document.createElement("thead");
    var headerRowNode = document.createElement("tr");
    this.headNode.appendChild(headerRowNode);

    var thSelectNode = document.createElement("th");
    headerRowNode.appendChild(thSelectNode);

    for (var x=0; x<columns.length; x++) {
      var column = columns[ x ];
      var thNode = document.createElement("th");
      thNode.innerText = column.label;
      headerRowNode.appendChild(thNode);
    }
    this.bodyNode = document.createElement("tbody");

    rootNode.appendChild(this.headNode);
    rootNode.appendChild(this.bodyNode);
    this.rootNode = rootNode;
  }
  getNode(){
    return this.rootNode;
  }
  commandPerformed(command, value){
    console.info("commandPerformed: ", command, value);
    var inputArr = this.bodyNode.getElementsByTagName("input");
    for (var x=0; x<inputArr.length; x++) {
      var inp = inputArr[ x ];
      if (command == "selection") {
        var selectArr = value;
        var foundMatch = false;
        for (var y=0; y<selectArr.length; y++) {
          var selectIndex = selectArr[ y ];
            if (selectIndex == x){
              foundMatch = true;
            }
        }
        inp.checked = foundMatch;
      }

    }
  }
  stateChanged(state, value){
    console.info("Table.stateChanged: ", state, value);
    if (state === this.comp.state) {
      this.bodyNode.innerHTML = "";

      var rows = this.collections.find(value);

      //var rows = value;
      var columns = this.comp.columns;
      for (var y=0; y<rows.length; y++){
        var rowData = rows[ y ];

        var rowNode = document.createElement("tr");
        this.bodyNode.appendChild(rowNode);

        var tdSelectNode = document.createElement("td");
        var checkboxNode = document.createElement("input");
        tdSelectNode.appendChild(checkboxNode);
        checkboxNode.setAttribute("type", "checkbox");
        checkboxNode.setAttribute("data-smartflow-id", rowData[ "id" ]);

        var ctrl = this.ctrl;
        checkboxNode.addEventListener("click", function () {
          ctrl.componentChanged(
            {
              "component": this,
              "event": "selection",
              "value": this.checked,
              "id": this.getAttribute("data-smartflow-id")
            }
          );
        });

        rowNode.appendChild(tdSelectNode);
        for (var x=0; x<columns.length; x++) {
          var column = columns[ x ];
          var cellData = rowData[ column.key ];
          var tdNode = document.createElement("td");
          rowNode.appendChild(tdNode);
          if (column.format) {
            tdNode.innerText = this.builder.formatter.formatDate(cellData, column.format);
          } else {
            tdNode.innerText = cellData;
          }
        }
      }
    }
  }
}


class Grid {
  constructor(comp, ctrl, builder){
    this.comp = comp;
    var node = document.createElement("div");
    node.setAttribute("id", comp.id);
    node.setAttribute("class", "mdc-layout-grid");
    var innerNode = document.createElement("div");
    innerNode.setAttribute("class", "mdc-layout-grid__inner");
    node.appendChild(innerNode);
    var items = this.comp.components;
    for (var x=0; x<items.length; x++) {
      var cellNode = document.createElement("div");
      cellNode.setAttribute("class", "mdc-layout-grid__cell");
      innerNode.appendChild(cellNode);
      builder.buildChildNode(cellNode, items[ x ]);
    }
    this.rootNode = node;
  }
  getNode(){
    return this.rootNode;
  }
  stateChanged(stateEvent){
    console.info("Label.stateChanged: ", stateEvent);
  }
}




class GridList {
  constructor(comp, ctrl, builder){
    this.comp = comp;
    this.collections = new Collections(comp);
    var node = document.createElement("div");
    node.setAttribute("id", comp.id);
    node.setAttribute("class", "mdc-grid-list");
    var ulNode = document.createElement("div");
    ulNode.setAttribute("class", "mdc-grid-list__tiles");
    node.appendChild(ulNode);
    this.ulNode = ulNode;
    this.rootNode = node;
  }
  getNode(){
    return this.rootNode;
  }
  stateChanged(state, value){
    console.info("GridList.stateChanged: ", state);
    this.ulNode.innerHTML = "";
    var urlPropertyName = this.comp[ "url" ];
    var baseUrl = this.comp["base"];
    var tooltip = this.comp["tooltip"];
    var maxItems = Number.isInteger(this.comp[ "max" ]) ? this.comp[ "max" ] : 3;
    var items = this.collections.find(value);
    for (var x=0; x<items.length; x++) {
      if (x > maxItems - 1){
        return;
      }
      var item = items[ x ];
      console.info( item);

      var liNode = document.createElement("div");
      liNode.setAttribute("class", "mdc-grid-tile");
      this.ulNode.appendChild(liNode);
      liNode.setA
      liNode.setAttribute("title", item[ tooltip ] );

      var primaryNode = document.createElement("div");
      primaryNode.setAttribute("class", "mdc-grid-tile__primary");
      liNode.appendChild(primaryNode);

      var primaryContentNode = document.createElement("div");
      primaryContentNode.setAttribute("class", "mdc-grid-tile__primary-content");
      primaryNode.appendChild(primaryContentNode);
      var url = baseUrl + item[ urlPropertyName ];
      primaryContentNode.style.backgroundImage = "url('" + url +  "')";

      var secondaryNode = document.createElement("span");
      secondaryNode.setAttribute("class", "mdc-grid-tile__secondary");
      liNode.appendChild(secondaryNode);


      var titleNode = document.createElement("span");
      titleNode.setAttribute("class", "mdc-grid-tile__title");
      titleNode.innerText = item[ "title" ];
      secondaryNode.appendChild(titleNode);
    }
  }
}

/**
 *
 *
 *
 */
class Collections{

  constructor(component){
    if (component.sort) {
      this.sortMatch = component.sort.match;
      this.sortOrder = component.sort.order;
    }
    this.sortEnabled = this.sortMatch !== undefined;

    this.pageSize = component.paging.size;
    this.pageIndex = component.paging.page;
    this.pageEnabled = this.pageSize !== undefined;

    this.filter = component.filter;
    this.filterEnabled = component.filter !== undefined;
  }

  find( items ){

    // Filter
    var filter = this.filter;
    var collectionFilter = function(item) {
      var count = 0;
      for (var x=0; x<filter.length; x++) {
        var f = filter[ x ];
        var filterMatch = f[ 'match' ];
        var filterType = f[ 'type' ];
        var filterValue = f[ 'value' ];
        var value = item[ filterMatch ];
        if (filterType === 'eq') {
          if (value === filterValue) {
            count++;
          }
        } else if (filterType === 'contains') {
          if (Array.isArray(value)) {
            var found = false;
            for (var y=0; y<value.length; y++) {
              if (value[y].toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                count++;
              }
            }
            if (found){
              count++;
            }
          } else {
            if (value.toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
              count++;
            }
          }
        }
      }
      return count === filter.length;
    };

    // Sorting
    var matchColumn = this.sortMatch;
    var negOrder = this.sortOrder === 'asc' ? -1 : 1;
    var posOrder = this.sortOrder === 'asc' ? 1 : -1;

    var collectionSorter = function(a, b){
      var nameA = a[ matchColumn ];
      var nameB = b[ matchColumn ];
      if (nameA < nameB) {
        return negOrder;
      }
      if (nameA > nameB) {
        return posOrder;
      }
      return 0;
    };

    // Paging
    var paging = function(items, page, size){
      var startIndex = page * size;
      var endIndex = startIndex + size;
      return items.slice( startIndex, endIndex );
    };

    var rows = items;
    if (this.filterEnabled) {
      rows = rows.filter(collectionFilter);
    }
    if (this.sortEnabled) {
      rows = rows.sort(collectionSorter);
    }
    if (this.pageEnabled){
      rows = paging(rows, this.pageIndex, this.pageSize);
    }
    return rows;
  }

}
