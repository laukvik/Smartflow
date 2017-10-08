/**
 * An action is a super class that all actions needs to extend
 * in order to be run by the Application class. asqew
 * export class ShowDialogAction extends Action {}
 *
 * @example <caption>Client side action</caption>
 * export class ShowDialogAction extends Action {
 *   getSmartflow() {
 *     return {
 *       "states": {
 *         "dialogVisible" : true
 *       }
 *     }
 *   }
 * }
 *
 * @example <caption>Server side action</caption>
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
export class Action {

  constructor() {
    this.smartflow = {};
  }

  getSmartflow() {
    return this.smartflow;
  }

}
