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
  buildRoot(name){
    this.setElement(document.createElement("div"));
    this.rootNode.setAttribute("class", name);
    var label = document.createElement("div");
    label.setAttribute("class", "sf-label" + (this.comp.required == true ? " sf-required" : ""));
    label.innerText = this.comp.label;
    this.rootNode.appendChild(label);
  }
  fireComponentChanged(property, value){
    this.smartflow.fireComponentChanged(this, property, value, this.ctrl);
  }
}

class Checkbox extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    this.buildRoot("sf-checkbox");
    this.setOptions(comp.options);
  }
  setOptions(items){
    if (Array.isArray(items)) {
      this.inputs = [];
      this.getElement().innerHTML = "";
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

class Radio  extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super(comp, ctrl, builder);
    this.buildRoot("sf-radio");
    this.setOptions(comp.options)
  }
  setOptions(items) {
    if (Array.isArray(items)) {
      this.inputs = [];
      this.getElement().innerHTML = "";
      var gui = "sf-radio-" + Math.round(100000);
      for (var x=0; x<items.length; x++) {
        var item = items[ x ];
        var itemText = item.text;
        var itemValue = item.value;
        var span = document.createElement("label");
        span.setAttribute("class", "sf-radio-option");
        this.rootNode.appendChild(span);
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
    this.buildRoot("sf-pulldown");

    var select = document.createElement("select");
    select.setAttribute("class", "sf-pulldown-select");
    this.rootNode.appendChild(select);

    var items = comp.options;
    for (var x=0; x<items.length; x++) {
      var item = items[ x ];
      var itemText = item.text;
      var itemValue = item.value;
      var option = document.createElement("option");
      select.appendChild(option);
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
    this.buildRoot("sf-textfield");

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
  stateChanged(stateEvent){
  }
}

class Button  extends SmartflowComponent{
  constructor(comp, ctrl, builder){
    super();
    var buttonNode = document.createElement("button");
    buttonNode.setAttribute("id", comp.id);
    buttonNode.setAttribute("class", "sf-button");
    buttonNode.innerText = comp.label;
    buttonNode.addEventListener("click", function () {
      if (comp.action){
        var func = window[ comp.action ];
        if (func){
          ctrl.runSmartflow(new func());
        }
      }
      if (ctrl.componentChanged) {
        ctrl.componentChanged(
          {
            "component": this,
            "event": "click"
          }
        );
      }
    });
    this.rootNode = buttonNode;
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














class Card {
  constructor(comp, ctrl, builder){
    var rootNode = document.createElement("div");
    rootNode.setAttribute("class", "mdc-card");

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
    builder._buildChildNodes(footerNode, comp.actions);

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
