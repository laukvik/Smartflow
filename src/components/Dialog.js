class Dialog extends SmartflowComponent {
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.buildRoot("sf-dialog");
    this.buttons = [];
    var modalNode = document.createElement("div");
    modalNode.setAttribute("class", "modal fade in");
    this.modalNode = modalNode;

    var modalDialog = document.createElement("div");
    modalDialog.setAttribute("class", "modal-dialog");
    modalNode.appendChild(modalDialog);

    var modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");

    var modalHeader = document.createElement("div");
    modalHeader.setAttribute("class", "modal-header");
    var modalBody = document.createElement("div");
    modalBody.setAttribute("class", "modal-body");

    this.modalBody = modalBody;

    var modalTitle = document.createElement("h4");
    this.modalTitle = modalTitle;

    modalHeader.appendChild(modalTitle);


    var modalFooter = document.createElement("div");
    modalFooter.setAttribute("class", "modal-footer");
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);

    modalDialog.appendChild(modalContent);
    modalNode.appendChild(modalDialog);
    this.getElement().appendChild(modalNode);

    if (Array.isArray(properties.components)) {
      var panelComponents = properties.components;
      for (var n = 0; n < panelComponents.length; n++) {
        var panelNode = document.createElement("div");
        var panelComponent = panelComponents[n];
        modalBody.appendChild(panelNode);
        builder.buildChildNode(panelNode, panelComponent);
      }
    }

    if (Array.isArray(properties.actions)) {
      for (var x=0; x<properties.actions.length; x++) {
        var component = properties.actions[ x ];

        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-default");
        btn.innerText = component.label;
        modalFooter.appendChild(btn);
        this.buttons.push(btn);

        btn.addEventListener("click", function (evt) {
          this._clicked(evt.srcElement);
        }.bind(this), false);

      }
    }
    this.setVisible(properties.visible);
    this.setTitle(properties.title);
  }

  _clicked(btn){
    var index = this.buttons.indexOf(btn);
    var a = this.properties.actions[ index ];
    this.fireAction(a.action);
  }

  setTitle(title){
    this.modalTitle.innerText = title;
  }

  setVisible(open){
    this.modalNode.style.display = open == true ? "block" : "none";
  }

  stateChanged(state, value) {
    if (state == this.properties.states.visible) {
      this.setVisible(value);
    } else if (state == this.properties.states.title) {
      this.setTitle(value);
    }
  }
}
