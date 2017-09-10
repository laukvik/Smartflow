/**
 * Progress
 *
 * Properties:
 * - value
 *
 */
class Progress extends SmartflowComponent {
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.buildRoot("sf-progress");

    var progressNode = document.createElement("div");
    progressNode.setAttribute("class", "progress");

    this.getElement().appendChild(progressNode);

    var progressBarNode = document.createElement("div");
    progressBarNode.setAttribute("class", "progress-bar progress-bar-striped");
    progressBarNode.setAttribute("role", "progressbar");
    this.progressBarNode = progressBarNode;
    progressNode.appendChild(progressBarNode);

    this.setValue( properties.value );
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

