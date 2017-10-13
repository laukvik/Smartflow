import {Action} from "./action";


/**
 * An action is a super class that all actions needs to extend
 * in order to be run by the Application class.
 *
 * @example
 *
 * export class ShowDialogAction extends Action {
 *   getSmartflow() {
 *     return {
 *       "states": {
 *         "dialogVisible" : true
 *       }
 *     }
 *   }
 * }

 */

/**
 *
 * @typedef {Object} ClientActionProperties
 * @property {path} type - the path
 * @property {states} type - the states
 *
 */
export class ClientAction extends Action {

  /**
   * Constructor for ClientAction
   *
   * @param {ClientActionProperties} props the properties for the action
   */
  constructor(props) {
    super(props);
    this.smartflow = {};
  }

  getSmartflow() {
    return this.smartflow;
  }

}
