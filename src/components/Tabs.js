import {PresentationComponent} from "../PresentationComponent";
import {Builder} from "../Builder";

/**
 *
 *
 *
 */
export class Tabs extends PresentationComponent {

  constructor() {
    super();
    this.labels = [];
    this.contents = [];
    this.links = [];
    this.createComponentNode("div");
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === "index") {
      this.setSelectedIndex(value);
    } else if (name === "tabs") {
      // this.setTabs(value);
    } else {
      console.warn("Tabs: Unknown property ", name);
    }
  }

  setTabs(tabs) {
    if (Array.isArray(tabs)) {
      this.labelsNode = document.createElement("ul");
      this.labelsNode.setAttribute("class", "nav nav-pills nav-justified");
      this.contentsNode = document.createElement("div");
      this.contentsNode.setAttribute("class", "sf-tabs-panels");
      this._componentNode.appendChild(this.labelsNode);
      this._componentNode.appendChild(this.contentsNode);

      for (let x = 0; x < tabs.length; x++) {
        let tab = tabs[x];
        let liNode = document.createElement("li");
        liNode.setAttribute("class", "nav-item");
        liNode.setAttribute("role", "presentation");
        this.labelsNode.appendChild(liNode);
        this.labels.push(liNode);

        let aNode = document.createElement("a");
        aNode.setAttribute("class", "nav-link");
        aNode.innerText = tab.label;
        liNode.appendChild(aNode);
        this.links.push(aNode);

        aNode.addEventListener("click", function (evt) {
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
            let c = Builder.buildComponentByProperties(panelComponent);
            contentNode.appendChild(c.getComponentNode());
          }
        }
      }

      this.setSelectedIndex(properties.selectedIndex);
    }

    return this._componentNode;
  }

  _selected(link) {
    let index = this.links.indexOf(link);
    this.setSelectedIndex(index);
  }

  setSelectedIndex(index) {
    if (index >= 0 && index < this.labels.length) {
      for (let x = 0; x < this.labels.length; x++) {
        let isActive = x === index;
        let css = (isActive ? "nav-link active" : "nav-link");
        let li = this.links[x];
        li.setAttribute("class", css);
        this.contents[x].style.display = isActive ? "block" : "none";
      }
    }
  }

}
