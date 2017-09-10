class Tabs extends SmartflowComponent {
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.buildRoot("sf-tabs");

    this.labelsNode = document.createElement("ul");
    this.labelsNode.setAttribute("class", "nav nav-tabs nav-justified");
    this.contentsNode = document.createElement("div");
    this.contentsNode.setAttribute("class", "sf-tabs-panels");
    this.getElement().appendChild(this.labelsNode);
    this.getElement().appendChild(this.contentsNode);

    this.labels = [];
    this.contents = [];
    this.links = [];

    if (Array.isArray(properties.tabs)) {
      for (var x = 0; x < properties.tabs.length; x++) {
        var tab = properties.tabs[x];
        var labelNode = document.createElement("li");
        labelNode.setAttribute("role", "presentation");
        this.labelsNode.appendChild(labelNode);
        this.labels.push(labelNode);

        var linkNode = document.createElement("a");
        labelNode.appendChild(linkNode);
        linkNode.innerText = tab.label;
        this.links.push(linkNode);

        linkNode.addEventListener("click", function (evt) {
          this._selected(evt.srcElement);
        }.bind(this), false);

        var contentNode = document.createElement("div");
        contentNode.setAttribute("class", "sf-tabs-panel");
        this.contentsNode.appendChild(contentNode);
        this.contents.push(contentNode);

        if (Array.isArray(tab.components)) {
          var panelComponents = tab.components;
          for (var n = 0; n < panelComponents.length; n++) {
            var panelNode = document.createElement("div");
            var panelComponent = panelComponents[n];
            contentNode.appendChild(panelNode);
            builder.buildChildNode(panelNode, panelComponent);
          }
        }
      }

      this.setSelectedIndex(properties.selectedIndex);


    }
  }

  _selected(link) {
    var index = this.links.indexOf(link);
    this.setSelectedIndex(index);
  }

  setSelectedIndex(index) {
    if (index >= 0 && index < this.labels.length) {
      for (var x = 0; x < this.labels.length; x++) {
        var css = (x === index ? "active" : "");
        var li = this.labels[x];
        li.setAttribute("class", css);
        this.contents[x].setAttribute("class", "sf-tabs-panel " + css);
      }
    } else {

    }
  }

}

