
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


class Button {
  constructor(comp, ctrl, builder){
    var buttonNode = document.createElement("button");
    buttonNode.setAttribute("id", comp.id);
    buttonNode.setAttribute("class", "mdc-button mdc-button--raised mdc-card__action");
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
  getNode(){
    return this.rootNode;
  }
  stateChanged(stateEvent){
    console.info("Button.stateChanged: ", stateEvent);
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
  stateChanged(state, value){
    console.info("Table.stateChanged: ", state, value);
    if (state === this.comp.state) {
      this.bodyNode.innerHTML = "";
      var rows = value;
      var columns = this.comp.columns;
      for (var y=0; y<rows.length; y++){
        var rowNode = document.createElement("tr");
        this.bodyNode.appendChild(rowNode);
        var rowData = rows[ y ];
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

class Label {
  constructor(comp, ctrl, builder){
    var node = document.createElement("label");
    node.setAttribute("id", comp.id);
    node.setAttribute("class", comp.class);
    node.innerText = comp.label;
    this.rootNode = node;
  }
  getNode(){
    return this.rootNode;
  }
  stateChanged(stateEvent){
    console.info("Label.stateChanged: ", stateEvent);
  }
}



class Textfield{
  constructor(comp, ctrl, builder){
    var node = document.createElement("div");

    var labelNode = document.createElement("label");
    labelNode.setAttribute("for", "my-textfield");
    labelNode.setAttribute("class", "mdc-label");
    labelNode.innerText = comp.label;

    var divNode = document.createElement("div");
    divNode.setAttribute("class", "mdc-textfield");

    var inputNode = document.createElement("input");
    inputNode.setAttribute("id", "my-textfield");
    inputNode.setAttribute("type", "text");
    inputNode.setAttribute("placeholder", comp.placeholder);
    inputNode.setAttribute("class", "mdc-textfield__input");

    node.appendChild(labelNode);
    node.appendChild(divNode);
    divNode.appendChild(inputNode);

    inputNode.addEventListener("keyup", function () {
      ctrl.componentChanged(
        {
          "component": this,
          "event": "keyup"
        }
      );
    });
    this.rootNode = node;
  }
  getNode(){
    return this.rootNode;
  }
  stateChanged(stateEvent){
    console.info("Textfield.stateChanged: ", stateEvent);
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
    var items = value;
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
