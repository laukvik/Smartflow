export default class GridList {
  constructor(comp, ctrl, builder) {
    this.comp = comp;
    this.collections = new Collections(comp);
    var node = document.createElement("div");
    node.setAttribute("id", comp.id);
    node.setAttribute("class", "mdc-grid-list");
    var ulNode = document.createElement("div");
    ulNode.setAttribute("class", "mdc-grid-list__tiles");
    node.appendChild(ulNode);
    this.ulNode = ulNode;
    this.rootNode = node;
  }

  getNode() {
    return this.rootNode;
  }

  stateChanged(state, value) {
    console.info("GridList.stateChanged: ", state);
    this.ulNode.innerHTML = "";
    var urlPropertyName = this.comp["url"];
    var baseUrl = this.comp["base"];
    var tooltip = this.comp["tooltip"];
    var maxItems = Number.isInteger(this.comp["max"]) ? this.comp["max"] : 3;
    var items = this.collections.find(value);
    for (var x = 0; x < items.length; x++) {
      if (x > maxItems - 1) {
        return;
      }
      var item = items[x];
      console.info(item);

      var liNode = document.createElement("div");
      liNode.setAttribute("class", "mdc-grid-tile");
      this.ulNode.appendChild(liNode);
      liNode.setA
      liNode.setAttribute("title", item[tooltip]);

      var primaryNode = document.createElement("div");
      primaryNode.setAttribute("class", "mdc-grid-tile__primary");
      liNode.appendChild(primaryNode);

      var primaryContentNode = document.createElement("div");
      primaryContentNode.setAttribute("class", "mdc-grid-tile__primary-content");
      primaryNode.appendChild(primaryContentNode);
      var url = baseUrl + item[urlPropertyName];
      primaryContentNode.style.backgroundImage = "url('" + url + "')";

      var secondaryNode = document.createElement("span");
      secondaryNode.setAttribute("class", "mdc-grid-tile__secondary");
      liNode.appendChild(secondaryNode);


      var titleNode = document.createElement("span");
      titleNode.setAttribute("class", "mdc-grid-tile__title");
      titleNode.innerText = item["title"];
      secondaryNode.appendChild(titleNode);
    }
  }
}
