import {Component} from "../Component";

export const HeadingSize = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
};

export const HeadingColor = {
  PRIMARY: "text-primary",
  SECONDARY: "text-secondary",
  SUCCESS: "text-success",
  DANGER: "text-danger",
  WARNING: "text-warning",
  INFO: "text-info",
  LIGHT: "text-light",
  DARK: "text-dark",
  MUTED: "text-muted",
  WHITE: "text-white"
};

/**
 * Displays a heading
 *
 */
export class Heading extends Component {

  constructor() {
    super();
    this.createComponentNode(HeadingSize.H1);
  }

  setProperty(name, value) {
    if (name === "value") {
      this.setValue(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "size") {
      this.setSize(value);
    } else if (name === "color") {
      this.setColor(value);
    } else {
      console.warn("Heading: Unknown property ", name);
    }
  }

  setColor(color){
    this.getComponentNode().setAttribute("class", color);
  }

  setValue(heading) {
    this.getComponentNode().innerText = heading;
  }

}
