/**
 * An action is a super class that all actions needs to extend
 * in order to be run by the Application class.
 *
 */
export class Action {

  constructor() {
    this.smartflow = {};
  }

  getSmartflow() {
    return this.smartflow;
  }

}
