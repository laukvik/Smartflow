import {PresentationComponent} from "../component";

export class Layout extends PresentationComponent {
  constructor(properties) {
    super(properties);
  }

  buildComponent(builder, properties){
    let div = document.createElement("div");

    if (properties.id){
      div.setAttribute("id", properties.id);
    }
    div.setAttribute("class", "sf-layout container" + (properties.class ? " " + properties.class : ""));

    let rows = document.createElement("div");
    rows.setAttribute("class", "row");
    div.appendChild(rows);

    let comp = this.properties;

    if (Array.isArray(comp.components)) {
      for (let x = 0; x < comp.components.length; x++) {
        let c = comp.components[x];
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
    return div;
  }
}
