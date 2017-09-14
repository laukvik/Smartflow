export default class Card extends InputComponent {
  constructor(comp, ctrl, builder) {
    super(comp, ctrl, builder);
    var rootNode = document.createElement("div");
    rootNode.setAttribute("class", "mdc-card");
    this.setElement(rootNode);

    var headerNode = document.createElement("section");
    headerNode.setAttribute("class", "mdc-card__primary");

    var h1Node = document.createElement("h1");
    h1Node.setAttribute("class", "mdc-card__title mdc-card__title--large");
    h1Node.innerText = comp.title;

    var h2Node = document.createElement("h2");
    h2Node.setAttribute("class", "mdc-card__subtitle");
    h2Node.innerText = comp.subtitle;

    var textNode = document.createElement("section");
    textNode.setAttribute("class", "mdc-card__supporting-text");

    var bodyNode = document.createElement("section");

    builder._buildChildNodes(bodyNode, comp.components);

    var footerNode = document.createElement("section");
    footerNode.setAttribute("class", "mdc-card__actions");

    if (Array.isArray(comp.actions)) {
      builder._buildChildNodes(footerNode, comp.actions);
    }


    rootNode.appendChild(headerNode);
    headerNode.appendChild(h1Node);
    headerNode.appendChild(h2Node);
    rootNode.appendChild(bodyNode);
    rootNode.appendChild(footerNode);

    this.rootNode = rootNode;
  }

  getNode() {
    return this.rootNode;
  }

  stateChanged(stateEvent) {
    console.info("Card.stateChanged: ", stateEvent);
  }
}
