class Grid {
  constructor(comp, ctrl, builder) {
    this.comp = comp;
    var node = document.createElement("div");
    node.setAttribute("id", comp.id);
    node.setAttribute("class", "mdc-layout-grid");
    var innerNode = document.createElement("div");
    innerNode.setAttribute("class", "mdc-layout-grid__inner");
    node.appendChild(innerNode);
    var items = this.comp.components;
    for (var x = 0; x < items.length; x++) {
      var cellNode = document.createElement("div");
      cellNode.setAttribute("class", "mdc-layout-grid__cell");
      innerNode.appendChild(cellNode);
      builder.buildChildNode(cellNode, items[x]);
    }
    this.rootNode = node;
  }

  getNode() {
    return this.rootNode;
  }

  stateChanged(stateEvent) {
    console.info("Label.stateChanged: ", stateEvent);
  }
}
