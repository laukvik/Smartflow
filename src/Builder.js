/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
import {Scope, SCOPES} from "./Scope";
import {InputComponent} from "./InputComponent";
import {Layout} from "./components/Layout";
import {Button} from "./components/Button";
import {Checkbox} from "./components/Checkbox";
import {Dialog} from "./components/Dialog";
import {Progress} from "./components/Progress";
import {Pulldown} from "./components/Pulldown";
import {Radio} from "./components/Radio";
import {Table} from "./components/Table";
import {Tabs} from "./components/Tabs";
import {Textfield} from "./components/Textfield";
import {Toolbar} from "./components/Toolbar";
import {Alert} from "./components/Alert";
import {Searchfield} from "./components/Searchfield";
import {Datepicker} from "./components/Datepicker";
import {Spinner} from "./components/Spinner";
import {Card} from "./components/Card";
import {List} from "./components/List";
import {Navbar} from "./components/Navbar";
import {Media} from "./components/Media";
import {Text} from "./components/Text";

export class Builder {

  constructor(ctrl, formatter, smartflow) {
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
  }

  _buildComponent(componentProperties) {
    if (!componentProperties.type) {
      return;
    }
    let c;
    if (typeof componentProperties.type === 'string') {
      let componentType = componentProperties.type.toLowerCase();
      if (componentType === 'button') {
        c = new Button(componentProperties);
      } else if (componentType === 'checkbox') {
        c = new Checkbox(componentProperties);
      } else if (componentType === 'dialog') {
        c = new Dialog(componentProperties);
      } else if (componentType === 'layout') {
        c = new Layout(componentProperties);
      } else if (componentType === 'progress') {
        c = new Progress(componentProperties);
      } else if (componentType === 'pulldown') {
        c = new Pulldown(componentProperties);
      } else if (componentType === 'radio') {
        c = new Radio(componentProperties);
      } else if (componentType === 'table') {
        c = new Table(componentProperties);
      } else if (componentType === 'tabs') {
        c = new Tabs(componentProperties);
      } else if (componentType === 'textfield') {
        c = new Textfield(componentProperties);
      } else if (componentType === 'toolbar') {
        c = new Toolbar(componentProperties);
      } else if (componentType === 'alert') {
        c = new Alert(componentProperties);
      } else if (componentType === 'searchfield') {
        c = new Searchfield(componentProperties);
      } else if (componentType === 'datepicker') {
        c = new Datepicker(componentProperties);
      } else if (componentType === 'spinner') {
        c = new Spinner(componentProperties);
      } else if (componentType === 'card') {
        c = new Card(componentProperties);
      } else if (componentType === 'list') {
        c = new List(componentProperties);
      } else if (componentType === 'navbar') {
        c = new Navbar(componentProperties);
      } else if (componentType === 'media') {
        c = new Media(componentProperties);
      } else if (componentType === 'text') {
        c = new Text(componentProperties);
      } else {
        console.warn("Component not found: ", componentProperties.type);
        return;
      }
      // c.setBaseClass(componentType);
    } else {
      c = new componentProperties.type();
    }
    c.setSmartflow(this.smartflow);
    c.setView(this.ctrl);
    if (componentProperties.id) {
      c.setID(componentProperties.id);
    }
    if (componentProperties.class) {
      c.setClass(componentProperties["class"]);
    }
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

  // parseScope(value) {
  //   let isString = typeof value === 'string';
  //   if (!isString) {
  //     return {
  //       "scope": SCOPES.NONE,
  //       "value": value
  //     };
  //   }
  //   if (value.indexOf("{") === 0 && value.lastIndexOf("}") === value.length - 1) {
  //     let innerValue = value.substring(1, value.length - 1);
  //     if (innerValue.toUpperCase().startsWith(SCOPES.GLOBAL)) {
  //       return {
  //         "scope": SCOPES.GLOBAL,
  //         "value": innerValue.substring(7)
  //       }
  //     } else {
  //       return {
  //         "scope": SCOPES.VIEW,
  //         "value": innerValue
  //       }
  //     }
  //   }
  //   return {
  //     "scope": SCOPES.NONE,
  //     "value": value
  //   };
  // }

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
