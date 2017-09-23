import {PresentationComponent} from "../component";

class Tabs extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.labels = [];
    this.contents = [];
    this.links = [];
    this._componentNode = document.createElement("ul");
  }

  setProperties(properties) {

  }

  buildComponent(builder, properties) {

    if (Array.isArray(this.properties.tabs)) {
      this.labelsNode = document.createElement("ul");
      this.labelsNode.setAttribute("class", "nav nav-tabs nav-justified");
      this.contentsNode = document.createElement("div");
      this.contentsNode.setAttribute("class", "sf-tabs-panels");
      this._componentNode.appendChild(this.labelsNode);
      this._componentNode.appendChild(this.contentsNode);

      for (let x = 0; x < this.properties.tabs.length; x++) {
        let tab = this.properties.tabs[x];
        let labelNode = document.createElement("li");
        labelNode.setAttribute("role", "presentation");
        this.labelsNode.appendChild(labelNode);
        this.labels.push(labelNode);

        let linkNode = document.createElement("a");
        labelNode.appendChild(linkNode);
        linkNode.innerText = tab.label;
        this.links.push(linkNode);

        linkNode.addEventListener("click", function (evt) {
          this._selected(evt.srcElement);
        }.bind(this), false);

        let contentNode = document.createElement("div");
        contentNode.setAttribute("class", "sf-tabs-panel");
        this.contentsNode.appendChild(contentNode);
        this.contents.push(contentNode);

        if (Array.isArray(tab.components)) {
          let panelComponents = tab.components;
          for (let n = 0; n < panelComponents.length; n++) {
            let panelComponent = panelComponents[n];
            builder.buildChildNode(contentNode, panelComponent);
          }
        }
      }

      this.setSelectedIndex(this.properties.selectedIndex);
    }

    this._componentNode.setAttribute("class", "sf-tabs" + (properties.class ? " " + properties.class : ""));
    return this._componentNode;
  }

  _selected(link) {
    let index = this.links.indexOf(link);
    this.setSelectedIndex(index);
  }

  setSelectedIndex(index) {
    if (index >= 0 && index < this.labels.length) {
      for (let x = 0; x < this.labels.length; x++) {
        let css = (x === index ? "active" : "");
        let li = this.labels[x];
        li.setAttribute("class", css);
        this.contents[x].setAttribute("class", "sf-tabs-panel " + css);
      }
    }
  }

}

export {Tabs};
