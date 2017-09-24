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
import {Searchfield} from "./components/Searchfield";
import {Datepicker} from "./components/Datepicker";
import {Spinner} from "./components/Spinner";

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
    let c;
    if (componentType === 'button') {
      c =  new Button(componentProperties);
    } else if (componentType === 'checkbox') {
      c =  new Checkbox(componentProperties);
    } else if (componentType === 'dialog') {
      c =  new Dialog(componentProperties);
    } else if (componentType === 'layout') {
      c =  new Layout(componentProperties);
    } else if (componentType === 'progress') {
      c =  new Progress(componentProperties);
    } else if (componentType === 'pulldown') {
      c =  new Pulldown(componentProperties);
    } else if (componentType === 'radio') {
      c =  new Radio(componentProperties);
    } else if (componentType === 'table') {
      c =  new Table(componentProperties);
    } else if (componentType === 'tabs') {
      c =  new Tabs(componentProperties);
    } else if (componentType === 'textfield') {
      c =  new Textfield(componentProperties);
    } else if (componentType === 'toolbar') {
      c =  new Toolbar(componentProperties);
    } else if (componentType === 'alert') {
      c =  new Alert(componentProperties);
    } else if (componentType === 'searchfield') {
      c =  new Searchfield(componentProperties);
    } else if (componentType === 'datepicker') {
      c =  new Datepicker(componentProperties);
    } else if (componentType === 'spinner') {
      c =  new Spinner(componentProperties);
    } else {
      console.warn("Component not found: ", componentProperties.type);
      return;
    }
    c.setSmartflow(this.smartflow);
    c.setView(this.ctrl);
    c.setID(componentProperties.id);
    c.setBaseClass(componentType);
    c.setClass(componentProperties.class);
    return c;
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
    componentInstance.setProperties(comp);

    if (isInputComponent) {
      componentInstance.setRootNode(node); //
      node = componentInstance.getRootNode();
    }
    if (node === undefined) {
      console.warn("Smartflow.builder: Component not found! ", comp);
    } else {
      parentNode.appendChild(node);
    }
    return componentInstance;
  }

}

