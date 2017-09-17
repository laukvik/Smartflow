/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
import {InputComponent} from "./component";
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

export class ComponentBuilder {
  constructor(ctrl, formatter, smartflow) {
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
  }

  _buildComponent(componentProperties) {
    if (!componentProperties.type) {
      return;
    }
    let componentType = componentProperties.type.toLowerCase();
    let f;
    if (componentType === 'button') {
      f =  new Button(componentProperties);
    } else if (componentType === 'checkbox') {
      f =  new Checkbox(componentProperties);
    } else if (componentType === 'dialog') {
      f =  new Dialog(componentProperties);
    } else if (componentType === 'layout') {
      f =  new Layout(componentProperties);
    } else if (componentType === 'progress') {
      f =  new Progress(componentProperties);
    } else if (componentType === 'pulldown') {
      f =  new Pulldown(componentProperties);
    } else if (componentType === 'radio') {
      f =  new Radio(componentProperties);
    } else if (componentType === 'table') {
      f =  new Table(componentProperties);
    } else if (componentType === 'tabs') {
      f =  new Tabs(componentProperties);
    } else if (componentType === 'textfield') {
      f =  new Textfield(componentProperties);
    } else if (componentType === 'toolbar') {
      f =  new Toolbar(componentProperties);
    } else if (componentType === 'alert') {
      f =  new Alert(componentProperties);
    } else {
      console.warn("Component not found: ", componentProperties.type);
      return;
    }
    f.setSmartflow(this.smartflow);
    f.setView(this.ctrl);
    return f;
  }

  buildComponents() {
    let ctrlID = this.ctrl.constructor.name;
    let comps = this.ctrl.smartflow.components;
    this.ctrl.smartflow.componentInstances = [];
    let rootNode = document.getElementById(ctrlID);
    for (let x = 0; x < comps.length; x++) {
      this.buildChildNode(rootNode, comps[x]);
    }
  }

  buildChildNode(parentNode, comp) {
    let componentInstance = this._buildComponent(comp);
    this.ctrl.smartflow.componentInstances.push(componentInstance);
    componentInstance.setStateBinding(comp.states);
    let isInputComponent = componentInstance instanceof InputComponent;

    let node = componentInstance.buildComponent(this, comp);
    if (isInputComponent) {
      componentInstance.setRootNode(node); //
      node = componentInstance.getRootNode();
    }
    if (node === undefined) {
      console.warn("Component not found", comp);
    } else {
      parentNode.appendChild(node);
    }
    return componentInstance;
  }



}

