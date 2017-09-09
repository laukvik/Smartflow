class Layout extends SmartflowComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    this.buildRoot("container");
    this.rows = document.createElement("div");
    this.getElement().appendChild(this.rows);
    this.rows.setAttribute("class", "row");

    if (Array.isArray(comp.components)) {
      for (var x = 0; x < comp.components.length; x++) {
        var c = comp.components[x];
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
