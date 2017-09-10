class Table extends SmartflowComponent{
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.dontUpdate = true;
    this.collections = new Collections(properties);
    this.selected = [];
    this.columns = [];
    this.rows = [];
    this.inputs = [];
    // Table
    var tableNode = document.createElement("table");
    tableNode.setAttribute("class", "table");
    // Head
    var theadNode = document.createElement("thead");
    var headerRowNode = document.createElement("tr");
    theadNode.appendChild(headerRowNode);
    tableNode.appendChild(theadNode);
    this.headerNode = headerRowNode;
    // Body
    var bodyNode = document.createElement("tbody");
    tableNode.appendChild(bodyNode);
    this.setElement(tableNode);
    this.setBodyNode(bodyNode);
    this.setRowKey(properties.rowKey)
    this.setSelectable(properties.selectable);
    this.setSelected(properties.selected);
    this.setColumns(properties.columns);
    this.dontUpdate = false;
  }

  setRowKey(rowKey){
    this.rowKey = rowKey;
  }

  setSelected(selected){
    if (Array.isArray(selected)) {
      this.selected = selected;
      for (var y = 0; y < this.inputs.length; y++) {
        var inputSelect = this.inputs[ y ];
        inputSelect.checked = this.selected.indexOf(inputSelect.getAttribute("id")) > -1;
      }
    } else {
      this.selected = [];
    }
  }

  getSelected(){
    return this.selected;
  }

  setColumns(columns){
    if (Array.isArray(columns)){
      this.columns = columns;
      this.removeChildNodes(this.headerNode);

      if (this.selectable) {
        var thSelectNode = document.createElement("th");
        this.headerNode.appendChild(thSelectNode);
      }

      for (var x = 0; x < columns.length; x++) {
        var column = columns[x];
        var thNode = document.createElement("th");
        thNode.innerText = column.label;
        this.headerNode.appendChild(thNode);
      }
    } else {
      this.columns = [];
    }
  }

  _update(){
    if (this.dontUpdate === false){
      this.setRows(this.rows);
    }
  }

  setSelectable(selectable){
    this.selectable = selectable == true;
    this.setColumns(this.columns);
    this._update();
  }

  setSort(sort){
    this.collections.setSort(sort);
    this._update();
  }

  setFilter(filter){
    if (Array.isArray(filter)) {
      this.collections.setFilter(filter);
      this._update();
    } else {
      this.filter = [];
    }
  }

  setPaging(paging){
    this.collections.setPaging(paging);
    this._update();
  }

  _changed(input){
    var id = input.getAttribute("id");
    if (input.checked) {
      this.selected.push( id );
    } else {
      var index= this.selected.indexOf( id );
      this.selected.splice(index, 1);
    }
    this.fireComponentChanged("selected", this.getSelected());
  }

  setRows(rowData){
    if (Array.isArray(rowData)){
    var rows = this.collections.find(rowData);
      this.rows = rows;
      this.removeChildNodes(this.getBodyNode());
      for (var y = 0; y < rows.length; y++) {
        var row = rows[y];
        var trNode = document.createElement("tr");
        this.getBodyNode().appendChild(trNode);

        if (this.selectable && this.rowKey != undefined) {
          var thSelectNode = document.createElement("td");
          trNode.appendChild(thSelectNode);
          var inputSelect = document.createElement("input");
          var rowKey = row[ this.rowKey ];
          this.inputs.push(inputSelect);
          inputSelect.setAttribute("id", rowKey);
          inputSelect.setAttribute("type", "checkbox");
          inputSelect.checked = this.selected.indexOf(rowKey) > - 1;
          thSelectNode.appendChild(inputSelect);
          inputSelect.addEventListener("click", function (evt) {
            this._changed(evt.srcElement);
          }.bind(this), false);
        }

        for (var x = 0; x < this.columns.length; x++) {
          var column = this.columns[x];
          var cellData = row[column.key];
          var tdNode = document.createElement("td");
          trNode.appendChild(tdNode);
          if (column.format) {
            tdNode.innerText = this.builder.formatter.formatDate(cellData, column.format);
          } else {
            tdNode.innerText = cellData;
          }
        }
      }
    }
  }

  stateChanged(state, value) {
    if (state == this.comp.states.rows) {
      this.setRows(value);
    } else if (state == this.comp.states.selected) {
      this.setSelected(value);
    } else if (state == this.comp.states.selectable) {
      this.setSelectable(value);
    } else if (state == this.comp.states.columns) {
      this.setColumns(value);
    } else if (state == this.comp.states.sort) {
      this.setSort(value);
    } else if (state == this.comp.states.filter) {
      this.setFilter(value);
    } else if (state == this.comp.states.paging) {
      this.setPaging(value);
    }
  }

  setProperty(name, value){
    if (name == "rows") {
      this.setRows(value);
    } else if (name == "selected") {
      this.setSelected(value);
    } else if (name == "columns") {
      this.setColumns(value);
    } else if (name == "sort") {
      this.setSort(value);
    } else if (name == "filter") {
      this.setFilter(value);
    } else if (name == "paging") {
      this.setPaging(value);
    }
  }

  commandPerformed(command, value) {
    this.setProperty(command, value);
  }

}
