import {PresentationComponent} from "../component";

/**
 * Progress
 *
 * Properties:
 * - value
 *
 */
export class Progress extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.value = 0;
  }

  buildComponent(builder, properties){
    let progressNode = document.createElement("div");
    progressNode.setAttribute("class", "progress");
    if (properties.id){
      progressNode.setAttribute("id", properties.id);
    }
    progressNode.setAttribute("class", "sf-progress" + (properties.class ? " " + properties.class : ""));

    let progressBarNode = document.createElement("div");
    progressBarNode.setAttribute("class", "progress-bar progress-bar-striped");
    progressBarNode.setAttribute("role", "progressbar");
    progressNode.appendChild(progressBarNode);
    this.progressNode = progressNode;
    this.progressBarNode = progressBarNode;
    return this.progressNode;
  }

  setValue(value){
    if (value >= 0 && value <= 100) {
      this.value = value;
    } else {
      this.value = 0;
    }
    this.progressBarNode.setAttribute("style", "width: " + value + "%");
  }

  getValue(){
    return this.value;
  }

  stateChanged(state, value) {
    if (state == this.properties.states.value) {
      this.setValue(value);
    }
  }
}

