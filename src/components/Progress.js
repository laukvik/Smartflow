import {PresentationComponent} from "../PresentationComponent";

export const ProgressbarStyle = {
  SUCCESS: "bg-success",
  DANGER: "bg-danger",
  WARNING: "bg-warning",
  INFO: "bg-info",
};

export class Progress extends PresentationComponent {

  constructor() {
    super();
    this.value = 0;
    this.createComponentNode("div");
    this.progressNode = document.createElement("div");
    this.progressNode.setAttribute("class", "progress");
    this.progressBarNode = document.createElement("div");
    this.progressBarNode.setAttribute("class", "progress-bar");
    this.progressBarNode.setAttribute("role", "progressbar");
    this.progressNode.appendChild(this.progressBarNode);
    this._helpNode = document.createElement("div");
    this._helpNode.setAttribute("class", "form-text text-muted");
    this._helpNode.innerText = "Loading...";
    this._componentNode.appendChild(this.progressNode);
    this._componentNode.appendChild(this._helpNode);
  }

  _updateClassName(){
    this.progressBarNode.setAttribute("class", "progress-bar"
      + (this._animated === true ? " progress-bar-animated" : "")
      + (this._striped === true ? " progress-bar-striped" : "")
      + (this._progressbarStyle ? " " + this._progressbarStyle : "")
    );
  }

  setProperty(name, value) {
    if (name === "value") {
      this.setValue(value);
    } else if (name === "visible") {
      this.setVisible(value);
    } else if (name === "progressbarStyle") {
      this.setProgressbarStyle(value);
    } else if (name === "animated") {
      this.setAnimated(true);
    } else if (name === "striped") {
      this.setStriped(true);
    } else {
      console.warn("Progress: Unknown property ", name);
    }
  }

  setValue(value) {
    if (value >= 0 && value <= 100) {
      this.value = value;
    } else {
      this.value = 0;
    }
    this.progressBarNode.setAttribute("style", "width: " + value + "%");
  }

  stateChanged(state, value) {
    if (state === this.properties.states.value) {
      this.setValue(value);
    }
  }

  setProgressbarStyle(progressbarStyle) {
    this._progressbarStyle = progressbarStyle;
    this._updateClassName();
  }

  setAnimated(animated) {
    this._animated = animated === true;
    this._updateClassName()
  }

  setStriped(striped) {
    this._striped = striped === true;
    this._updateClassName()
  }
}

