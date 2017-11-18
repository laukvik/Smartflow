/**
 * An action is a super class that all actions needs to extend
 * in order to be run by the Application class.
 *
 * @private
 */

export class Action {

  /**
   * Constructor for Action
   *
   * @param {ServerActionProperties} props the properties for the action
   */
  constructor(props) {
    this.smartflow = {};
  }

  static isAction(action) {
    return Object.getPrototypeOf(action) instanceof ClientAction || Object.getPrototypeOf(action) instanceof ServerAction;
  }

  /**
   * Returns the instructions for the action
   *
   * @returns {{}|*}
   */
  getSmartflow() {
    return this.smartflow;
  }

}

/**
 * An action is a super class that all actions needs to extend
 * in order to be run by the Application class.
 *
 * @example
 *
 * export class FindGlobalMovies extends Action {
 *  getSmartflow() {
 *    return {
 *      "request": {
 *        "url": "movies.json",
 *        "method": "get",
 *        "type": "json"
 *      },
 *      "success": {
 *        "path": "/",
 *        "global": "movies",
 *      },
 *      "error": {
 *        "path": "/",
 *        "global": "moviesFailed"
 *      }
 *    }
 *  }
 */

/**
 *
 * @typedef {Object} ServerActionProperties
 * @property {path} type - always Textfield
 * @property {request.url} type - the url
 * @property {request.method} type - the method
 * @property {request.type} type - the type
 *
 *
 * @property {success.path} label - the path navigate to when successful
 * @property {success.global} label - the global state to set the value to when successful
 * @property {success.private} label - the private state to set the value to when successful
 *
 * @property {error.path} label - the path navigate to when error
 * @property {error.global} label - the global state to set the value to when error
 * @property {error.private} label - the private state to set the value to when error
 *
 */
export class ServerAction extends Action {

  /**
   * Constructor for Action
   *
   * @param {ServerActionProperties} props the properties for the action
   */
  constructor(props) {
    super(props);
    this.smartflow = {};
  }

  getSmartflow() {
    return this.smartflow;
  }

}




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
