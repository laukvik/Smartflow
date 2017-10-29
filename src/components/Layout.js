import {PresentationComponent} from "../PresentationComponent";

export class Layout extends PresentationComponent {

  constructor(properties) {
    super(properties);
    this.createComponentNode("div", "Layout");
  }

  setProperties(properties) {
    this._componentNode.setAttribute("class", "container");
  }

  buildComponent(builder, properties) {
    let rows = document.createElement("div");
    rows.setAttribute("class", "row");
    this._componentNode.appendChild(rows);
    if (Array.isArray(properties.components)) {
      for (let x = 0; x < properties.components.length; x++) {
        let c = properties.components[x];
        // Grid
        let layoutCell = document.createElement("div");
        if (c.layout) {
          let layout = c.layout;
          let colsXS = layout["col-xs"] === undefined ? "" : " col-xs-" + c["col-xs"];
          let colsSM = layout["col-sm"] === undefined ? "" : " col-sm-" + c["col-sm"];
          let colsMD = layout["col-md"] === undefined ? "" : " col-md-" + c["col-md"];
          let colsLG = layout["col-lg"] === undefined ? "" : " col-lg-" + c["col-lg"];
          let colsXL = layout["col-xl"] === undefined ? "" : " col-xl-" + c["col-xl"];
          let gridClass = (colsXS + colsSM + colsMD + colsLG + colsXL);
          layoutCell.setAttribute("class", gridClass);
        }
        rows.appendChild(layoutCell);
        builder.buildChildNode(layoutCell, c);
      }
    }
    return this._componentNode;
  }
}
