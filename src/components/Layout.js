import {PresentationComponent} from "../PresentationComponent";
import {Builder} from "../Builder";

export const LayoutSize = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
};

export class Layout extends PresentationComponent {

  constructor() {
    super();
    this.createComponentNode("div");
    this.getComponentNode().setAttribute("class", "container-fluid");
    this._fullwidth = true;
  }

  setProperty(name, value) {
    if (name === "components") {
      this.setComponents(value);
    } else if (name === "full"){
      this.setFullWidth(value);
    } else {
      console.warn("Layout: Unknown property ", name);
    }
  }

  _updateClass(){
    this.getComponentNode().setAttribute("class", this._fullwidth ? "container-fluid" : "container");
  }

  setFullWidth(fullwidth) {
    this._fullwidth = fullwidth === true;
    this._updateClass();
  }

  static parseGridLayout(layout){
    let gridClass = "";
    if (layout[LayoutSize.XS]) {
      gridClass += " col-xs-" + layout[LayoutSize.XS];
    }
    if (layout[LayoutSize.SM]) {
      gridClass += " col-sm-" + layout[LayoutSize.SM];
    }
    if (layout[LayoutSize.MD]) {
      gridClass += " col-md-" + layout[LayoutSize.MD];
    }
    if (layout[LayoutSize.LG]) {
      gridClass += " col-lg-" + layout[LayoutSize.LG];
    }
    if (layout[LayoutSize.XL]) {
      gridClass += " col-xl-" + layout[LayoutSize.XL];
    }

    return gridClass.trim();
  }

  setComponents(components) {
    this.removeChildNodes(this.getComponentNode());
    const rows = document.createElement("div");
    rows.setAttribute("class", "row");
    this.getComponentNode().appendChild(rows);
    if (Array.isArray(components)) {
      for (let x = 0; x < components.length; x++) {
        const component = components[x];
        // Grid
        const layoutCell = document.createElement("div");
        if (component.layout) {
          const {layout} = component;
          layoutCell.setAttribute("class", Layout.parseGridLayout(layout));
        } else {
          console.warn("Layout: No layout");
        }
        rows.appendChild(layoutCell);
        const c = Builder.buildComponentByProperties(component, this.getView());
        layoutCell.appendChild(c.getComponentNode());
      }
    }
  }
}
