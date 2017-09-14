/**
 * Progress
 *
 * Properties:
 * - value
 *
 */
export default class Progress extends PresentationComponent {
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.value = 0;
  }

  buildComponent(){
    var progressNode = document.createElement("div");
    progressNode.setAttribute("class", "progress");

    var progressBarNode = document.createElement("div");
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

