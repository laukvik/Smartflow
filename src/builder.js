

/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
class ComponentBuilder{
  constructor(ctrl, formatter, smartflow){
    this.ctrl = ctrl;
    this.formatter = formatter;
    this.smartflow = smartflow;
  }
  buildComponents() {
    var ctrlID = this.ctrl.constructor.name;
    var comps = this.ctrl.smartflow.components;
    this.ctrl.smartflow.componentInstances = [];
    this._buildChildNodes( document.getElementById(ctrlID), comps);
  };
  buildChildNode(parentNode, comp) {
    var componentInstance = this._buildComponent(comp);
    this.ctrl.smartflow.componentInstances.push(componentInstance);
    var node = componentInstance.getElement();
    if (node === undefined) {
      console.info("Component not found", comp);
    } else {
      if (comp.hidden == 'true') {
        node.style.display = 'none';
      }
      parentNode.appendChild(node);
    }
    return componentInstance;
  }
  _buildChildNodes(parentNode, components){
    for (var x=0; x<components.length; x++) {
      var comp = components[x];
      var componentInstance = this._buildComponent(comp);
      componentInstance.id = comp.id;
      this.ctrl.smartflow.componentInstances.push(componentInstance);
      var node = componentInstance.getElement();
      if (node === undefined) {
        console.info("Component not found", comp);
      } else {
        if (comp.hidden == 'true') {
          node.style.display = 'none';
        }
        parentNode.appendChild(node);
      }
    }
  };
  _buildComponent(comp){
    //var func = window[ comp.type ]; // Vanilla
    var func = eval(comp.type); // ES
    if (func){
      var f = new func(comp, this.ctrl, this);
      f.setSmartflow(this.smartflow);
      return f;
    } else {
      console.info("Component not found: ", comp.type);
      return undefined;
    }
  };

  buildDialog( dialogID, title, body, buttons ){
    var buttonsHtml = "";

    for (var x=0; x<buttons.length; x++) {
      var btn = buttons[ x ];
      var buttonID = dialogID + "__button__" + btn.value;
      buttonsHtml += "<button type=\"button\" id=\"" +
        buttonID +"\"  class=\"mdc-button mdc-dialog__footer__button mdc-button--raised\">" + btn.label + "</button>";
    }

    return "<aside id=\"" + dialogID + "\"\n" +
      "       class=\"mdc-dialog mdc-dialog--open\" role=\"alertdialog\"\n" +
      "       aria-labelledby=\"my-mdc-dialog-label\" aria-describedby=\"my-mdc-dialog-description\">\n" +
      "  <div class=\"mdc-dialog__surface\">\n" +
      "    <header class=\"mdc-dialog__header\">\n" +
      "      <h2 class=\"mdc-dialog__header__title\">"+ title +"</h2>\n" +
      "    </header>\n" +
      "    <section id=\"my-mdc-dialog-description\" class=\"mdc-dialog__body\">"+ body +"</section>\n" +
      "    <footer class=\"mdc-dialog__footer\">\n" + buttonsHtml +
      "    </footer>\n" +
      "  </div>\n" +
      "  <div class=\"mdc-dialog__backdrop\"></div>\n" +
      "</aside>";
  }
}

