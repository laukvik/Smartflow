/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
export default class ComponentBuilder {
  constructor(ctrl, formatter, smartflow) {
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
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
    var isInputComponent = componentInstance instanceof InputComponent;

    var node = componentInstance.buildComponent(this, comp);
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

  _buildComponent(comp) {
    var func = eval(comp.type); // ES
    if (func) {
      var f = new func(comp);
      f.setSmartflow(this.smartflow);
      f.setView(this.ctrl);
      return f;
    } else {
      console.info("Component not found: ", comp.type);
      return undefined;
    }
  }

  buildDialog(dialogID, title, body, buttons) {
    var buttonsHtml = "";

    for (var x = 0; x < buttons.length; x++) {
      var btn = buttons[x];
      var buttonID = dialogID + "__button__" + btn.value;
      buttonsHtml += "<button type=\"button\" id=\"" +
        buttonID + "\"  class=\"mdc-button mdc-dialog__footer__button mdc-button--raised\">" + btn.label + "</button>";
    }

    return "<aside id=\"" + dialogID + "\"\n" +
      "       class=\"mdc-dialog mdc-dialog--open\" role=\"alertdialog\"\n" +
      "       aria-labelledby=\"my-mdc-dialog-label\" aria-describedby=\"my-mdc-dialog-description\">\n" +
      "  <div class=\"mdc-dialog__surface\">\n" +
      "    <header class=\"mdc-dialog__header\">\n" +
      "      <h2 class=\"mdc-dialog__header__title\">" + title + "</h2>\n" +
      "    </header>\n" +
      "    <section id=\"my-mdc-dialog-description\" class=\"mdc-dialog__body\">" + body + "</section>\n" +
      "    <footer class=\"mdc-dialog__footer\">\n" + buttonsHtml +
      "    </footer>\n" +
      "  </div>\n" +
      "  <div class=\"mdc-dialog__backdrop\"></div>\n" +
      "</aside>";
  }
}

