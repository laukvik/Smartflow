/**
 *
 * @typedef {Object} ViewProperties
 * @property {id} id - the Html Element ID
 * @property {path} path - the path to active this view to. E.g /category/{category}/{id}.
 * @property {components} components - an array of components
 *
 */

/**
 * An abstract class.
 *
 */
export class View {

  /**
   * Constructor for Textfield
   *
   * @param {ViewProperties} props the properties for the component
   */
  constructor(props) {
  }

  setSmartflowInstance(smartflow) {
    this.__smartflowInstance = smartflow;
  }

  /**
   * Starts an action.
   *
   * @param {Action} action the action to start
   */
  runAction(action) {
    this.__smartflowInstance.runAction(action, this);
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
   * Indicates the private state  changed
   *
   * @param {String} state the name
   * @param {Object} value the value
   */
  stateChanged(state, value) {
  }

  /**
   * Indicates the global state changed
   *
   * @param {String} state the name
   * @param {Object} value the value
   */
  globalChanged(state, value) {
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

  /**
   * Indicates the path was changed. When the active path is /category/12/15 and the path in the properties
   * is /category/{category}/{id} the event will be:
   *
   * {
   *   category: 12,
   *   id: 15
   * }
   *
   * @param evt
   */
  pathChanged(evt) {

  }

}
