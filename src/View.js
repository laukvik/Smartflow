export class View {
  setSmartflowInstance(smartflow){
    console.info("View.setSmartflowInstance");
    this.__smartflowInstance = smartflow;
  }
  runSmartflow(action){
    console.info("View.runAction: ", action);
    this.__smartflowInstance.runAction(action, this);
  }

  pathChanged(path, params) {
    console.info("View.pathChanged", path, params);
  };

  viewInitialized() {
    console.info("View.viewInitialized");
  };


  viewEnabled() {
    console.info("View.ViewEnabled");
  };

  viewDisabled() {
    console.info("View.viewDisabled");
  };

  stateChanged(state, value) {
    console.info("View.stateChanged: ", state, value);
  };

  actionPerformed(evt) {
    console.info("View.actionPerformed: ", evt);
  };

  componentChanged(evt) {
    console.info("View.componentChanged: ", evt);
  }

}
