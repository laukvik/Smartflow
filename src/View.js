export class View {
  setSmartflowInstance(smartflow){
    this.__smartflowInstance = smartflow;
  }
  runSmartflow(action){
    this.__smartflowInstance.runAction(action, this);
  }

  pathChanged(path, params) {
  }

  viewInitialized() {
  }


  viewEnabled() {
  }

  viewDisabled() {
  }

  stateChanged(state, value) {
  }

  actionPerformed(evt) {
  }

  componentChanged(evt) {
  }

}
