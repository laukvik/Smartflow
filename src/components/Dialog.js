class Dialog {
  constructor(comp, ctrl, builder) {
    var rootNode = document.createElement("aside");
    rootNode.setAttribute("id", comp.id);
    rootNode.setAttribute("class", "mdc-dialog mdc-dialog--open");
    rootNode.setAttribute("role", "alertdialog");

    var surfaceNode = document.createElement("div");
    surfaceNode.setAttribute("class", "mdc-dialog__surface");

    var headerNode = document.createElement("header");

    headerNode.setAttribute("class", "mdc-dialog__header");

    var titleNode = document.createElement("h2");

    titleNode.setAttribute("class", "dialog__header__title");
    titleNode.innerText = comp.title;


    var backdropNode = document.createElement("div");
    backdropNode.setAttribute("class", "mdc-dialog__backdrop");

    var bodyNode = document.createElement("section");
    bodyNode.setAttribute("class", "mdc-dialog__body");

    var footerNode = document.createElement("section");
    footerNode.setAttribute("class", "mdc-dialog__footer");

    builder._buildChildNodes(footerNode, comp.actions);

    rootNode.appendChild(surfaceNode);
    surfaceNode.appendChild(headerNode);
    surfaceNode.appendChild(bodyNode);
    surfaceNode.appendChild(footerNode);
    headerNode.appendChild(titleNode);
    rootNode.appendChild(backdropNode);

    this.rootNode = rootNode;
  }

  getNode() {
    return this.rootNode;
  }

  stateChanged(stateEvent) {
    console.info("Dialog.stateChanged: ", stateEvent);
  }
}
