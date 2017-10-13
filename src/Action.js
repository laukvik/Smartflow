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

  /**
   * Returns the instructions for the action
   *
   * @returns {{}|*}
   */
  getSmartflow() {
    return this.smartflow;
  }

}
