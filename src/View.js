/**
 * View.
 *
 */
export class View {

  setSmartflowInstance(smartflow) {
    this.__smartflowInstance = smartflow;
  }

  /**
   * Starts an action.
   *
   * @param {Action} action the action to start
   */
  runSmartflow(action) {
    this.__smartflowInstance.runAction(action, this);
  }

  pathChanged(path, params) {
  }

  /**
   * Indicates the view can initialize itself.
   */
  viewInitialized() {
  }

  /**
   * Indicates the view has been enabled
   */
  viewEnabled() {
  }

  /**
   * Indicates the view has been disabled
   */
  viewDisabled() {
  }

  /**
   * Indicates a state has been changed
   *
   * @TODO - Should add globalStateChanged method
   *
   * @param {String} state the named state
   * @param {Object} value the value of the state
   */
  stateChanged(state, value) {
  }

  /**
   * An action was performed.
   *
   * @param {Object} evt the event details
   */
  actionPerformed(evt) {
  }

  componentChanged(evt) {
  }

}
