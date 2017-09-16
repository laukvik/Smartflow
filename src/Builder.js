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
import Checkbox from "./components/Checkbox";
import {Dialog} from "./components/Dialog";
import {Progress} from "./components/Progress";
import {Pulldown} from "./components/Pulldown";
import {Radio} from "./components/Radio";
import {Table} from "./components/Table";
import {Tabs} from "./components/Tabs";
import {Textfield} from "./components/Textfield";
import {Toolbar} from "./components/Toolbar";

export class ComponentBuilder {
  constructor(ctrl, formatter, smartflow) {
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
  }

  _buildComponent(comp) {
    let componentType = comp.type.toLowerCase();
    let f = null;
    if (componentType === 'button') {
      f = new Button(comp);
    } else if (componentType === 'checkbox') {
      f = new Checkbox(comp);
    } else if (componentType === 'dialog') {
      f = new Dialog(comp);
    } else if (componentType === 'layout') {
      f = new Layout(comp);
    } else if (componentType === 'progress') {
      f = new Progress(comp);
    } else if (componentType === 'pulldown') {
      f = new Pulldown(comp);
    } else if (componentType === 'radio') {
      f = new Radio(comp);
    } else if (componentType === 'table') {
      f = new Table(comp);
    } else if (componentType === 'tabs') {
      f = new Tabs(comp);
    } else if (componentType === 'textfield') {
      f = new Textfield(comp);
    } else if (componentType === 'toolbar') {
      f = new Toolbar(comp);

    } else {
      console.warn("Component not found: ", comp.type);
      return;
    }

    //var func = eval(comp.type); // ES
    if (f !== null) {
      //var f = new func(comp);
      f.setSmartflow(this.smartflow);
      f.setView(this.ctrl);
      return f;
    } else {
      console.warn("Component not found: ", comp.type);
      return undefined;
    }
  }

  buildComponents() {
    var ctrlID = this.ctrl.constructor.name;
    var comps = this.ctrl.smartflow.components;
    this.ctrl.smartflow.componentInstances = [];
    var rootNode = document.getElementById(ctrlID);
    for (var x = 0; x < comps.length; x++) {
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

