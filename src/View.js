/**
 *
 * @typedef {Object} ViewProperties
 * @property {id} id - the Html Element ID
 * @property {path} path - the path to active this view to. E.g /category/{category}/{id}.
 * @property {components} components - an array of components
 *
 */

import {Builder} from "./Builder";

/**
 * An abstract class.
 *
 */
export class View {

  constructor() {
    this._smartflowComponentInstances = [];
  }

  mapBinding(component){
    this._smartflowComponentInstances.push(component);
  }

  static isView(view) {
    return view instanceof View;
  }

  buildViewComponents(components){
    if (Array.isArray(components)){
      this._components = Builder.buildComponentsByProperties(components, this);
      this._components.forEach( b => {
        this.getViewElement().appendChild(b.getComponentNode());
      });
    }
  }

  setVisible(visible){
    const el = this.getViewElement();
    el.style.display = visible ? "block" : "none";
  }

  getViewElement(){
    return document.getElementById(this.constructor.name);
  }

  setApplication(application){
    this.__smartflowInstance = application;
  }

  getApplication(){
    return this.__smartflowInstance;
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
    this.setVisible(true);
  }

  /**
   * Indicates the view has been disabled
   */
  viewDisabled() {
    this.setVisible(false);
  }

  // /*eslint-disable no-alert, no-console */
  // /**
  //  * Indicates the private state  changed
  //  *
  //  * @param {String} state the name
  //  * @param {Object} value the value
  //  */
  // stateChanged(state, value) {
  // }
  //
  // /**
  //  * Indicates the global state changed
  //  *
  //  * @param {String} state the name
  //  * @param {Object} value the value
  //  */
  // globalChanged(state, value) {
  // }
  //
  // /**
  //  * An action was performed.
  //  *
  //  * @param {Object} evt the event details
  //  */
  // actionPerformed(evt) {
  // }
  //
  // componentChanged(evt) {
  // }
  //
  // /**
  //  * Indicates the path was changed. When the active path is /category/12/15 and the path in the properties
  //  * is /category/{category}/{id} the event will be:
  //  *
  //  * {
  //  *   category: 12,
  //  *   id: 15
  //  * }
  //  *
  //  * @param evt
  //  */
  // pathChanged(evt) {
  // }
  // /*eslint-enable no-alert */

}
