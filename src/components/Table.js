class Table {
  constructor(comp, ctrl, builder) {
    this.comp = comp;
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

    for (var x = 0; x < columns.length; x++) {
      var column = columns[x];
      var thNode = document.createElement("th");
      thNode.innerText = column.label;
      headerRowNode.appendChild(thNode);
    }
    this.bodyNode = document.createElement("tbody");

    rootNode.appendChild(this.headNode);
    rootNode.appendChild(this.bodyNode);
    this.rootNode = rootNode;
  }

  getNode() {
    return this.rootNode;
  }

  commandPerformed(command, value) {
    console.info("commandPerformed: ", command, value);
    var inputArr = this.bodyNode.getElementsByTagName("input");
    for (var x = 0; x < inputArr.length; x++) {
      var inp = inputArr[x];
      if (command == "selection") {
        var selectArr = value;
        var foundMatch = false;
        for (var y = 0; y < selectArr.length; y++) {
          var selectIndex = selectArr[y];
          if (selectIndex == x) {
            foundMatch = true;
          }
        }
        inp.checked = foundMatch;
      }

    }
  }

  stateChanged(state, value) {
    console.info("Table.stateChanged: ", state, value);
    if (state === this.comp.state) {
      this.bodyNode.innerHTML = "";

      var rows = this.collections.find(value);

      //var rows = value;
      var columns = this.comp.columns;
      for (var y = 0; y < rows.length; y++) {
        var rowData = rows[y];

        var rowNode = document.createElement("tr");
        this.bodyNode.appendChild(rowNode);

        var tdSelectNode = document.createElement("td");
        var checkboxNode = document.createElement("input");
        tdSelectNode.appendChild(checkboxNode);
        checkboxNode.setAttribute("type", "checkbox");
        checkboxNode.setAttribute("data-smartflow-id", rowData["id"]);

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
        for (var x = 0; x < columns.length; x++) {
          var column = columns[x];
          var cellData = rowData[column.key];
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
