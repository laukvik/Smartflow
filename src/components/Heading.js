import {Component} from "../Component";

export const HeadingSize = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
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
    } else {
      console.warn("Heading: Unknown property ", name);
    }
  }

  buildComponent(){
    return this.getComponentNode();
  }

  setValue(heading) {
    this.getComponentNode().innerText = heading;
  }

}
