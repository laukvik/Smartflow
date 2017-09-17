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

        let colsXS = c["col-xs"] === undefined ? "" : " col-xs-" + c["col-xs"];
        let colsSM = c["col-sm"] === undefined ? "" : " col-sm-" + c["col-sm"];
        let colsMD = c["col-md"] === undefined ? "" : " col-md-" + c["col-md"];
        let colsLG = c["col-lg"] === undefined ? "" : " col-lg-" + c["col-lg"];
        let colsXL = c["col-xl"] === undefined ? "" : " col-xl-" + c["col-xl"];

        let gridClass = (colsXS + colsSM + colsMD + colsLG + colsXL);

        let layoutCell = document.createElement("div");
        layoutCell.setAttribute("class", gridClass);
        rows.appendChild(layoutCell);
        builder.buildChildNode(layoutCell, c);
      }
    }
    return div;
  }
}
