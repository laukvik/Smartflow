/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
import {Scope, SCOPES} from "./Scope";

export class Builder {

  constructor(ctrl, formatter, smartflow) {
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
  }

  _buildComponent(componentProperties) {
    let c = new componentProperties.type();
    c.setSmartflow(this.smartflow);
    c.setView(this.ctrl);
    return c;
  }

  buildComponents() {
    let viewElementId = this.ctrl.constructor.name;
    let comps = this.ctrl.smartflow.components;
    this.ctrl.smartflow.componentInstances = [];
    let rootNode = document.getElementById(viewElementId);
    if (rootNode === null || rootNode === undefined) {
      console.error("Smartflow: Failed to find element for view: ", viewElementId);
      return;
    }
    for (let x = 0; x < comps.length; x++) {
      this.buildChildNode(rootNode, comps[x]);
    }
  }

  /**
   * Recursively iterates all properties and binds properties to states
   *
   * @param componentInstance
   * @param comp
   * @param path
   */
  applyBindings(componentInstance, comp, path) {
    if (comp === undefined) {
      return;
    }
    if (typeof comp === "object") {
      for (let key in comp) {
        if (key !== "type") { // Type is reserved
          let value = comp[key];
          path.push(key);
          let bind = Scope.parseScope(value);
          //let bind = this.parseScope(value);
          if (bind.scope === SCOPES.NONE) {
            componentInstance.setProperty(key, bind.value);
            this.applyBindings(componentInstance, value, path); // TODO - FIX THIS
            path.pop();
          } else {
            componentInstance.setBinding(key, bind.value, bind.scope, path.shift());
          }
        }
      }
    }
  }

  buildChildNode(parentNode, comp) {
    let componentInstance = this._buildComponent(comp);
    this.ctrl.smartflow.componentInstances.push(componentInstance);
    let node = componentInstance.buildComponent(this, comp);
    this.applyBindings(componentInstance, comp, []);
    componentInstance.setProperties(comp);
    // if (componentInstance instanceof InputComponent) {
    //   componentInstance.setRootNode(node); //
    //   node = componentInstance.getRootNode();
    // }
    if (node === undefined) {
      console.warn("Smartflow.builder: Component not found! ", comp);
    } else {
      parentNode.appendChild(node);
    }
    return componentInstance;
  }

}

