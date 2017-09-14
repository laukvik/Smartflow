export default class Dialog extends PresentationComponent {
  constructor(properties, ctrl) {
    super(properties, ctrl);
    this.buttons = [];
    this.components = [];
  }

  buildComponent(builder, properties){
    this.dialogValidatoonNode = document.createElement("div");
    this.dialogValidatoonNode.setAttribute("class", "alert alert-warning alert-dismissible");
    this.dialogValidatoonNode.style.display = "none";
    let div = document.createElement("div");

    this.dialogNode = div;

    div.setAttribute("tabindex", "-1");
    div.setAttribute("role", "dialog");
    div.setAttribute("class", "modal fade in");

    let dialog = document.createElement("div");
    div.setAttribute("role", "document");
    dialog.setAttribute("class", "modal-dialog");

    let content = document.createElement("div");
    content.setAttribute("class", "modal-content");

    let contentHeader = document.createElement("div");
    contentHeader.setAttribute("class", "modal-header");

    let contentBody = document.createElement("div");
    contentBody.setAttribute("class", "modal-body");

    let modalTitle = document.createElement("h4");
    contentHeader.appendChild(modalTitle);

    let contentFooter = document.createElement("div");
    contentFooter.setAttribute("class", "modal-footer");



    div.appendChild(dialog);
    dialog.appendChild(content);
    content.appendChild(contentHeader);
    content.appendChild(contentBody);
    content.appendChild(contentFooter);


    contentBody.appendChild(this.dialogValidatoonNode);

    if (Array.isArray(properties.components)) {
      let panelComponents = properties.components;
      for (let n = 0; n < panelComponents.length; n++) {
        let panelNode = document.createElement("div");
        let panelComponent = panelComponents[n];

        contentBody.appendChild(panelNode);
        var componentInstance = builder.buildChildNode(panelNode, panelComponent);

        this.components.push(componentInstance);
      }
    }


    if (Array.isArray(properties.actions)) {
      for (let x=0; x<properties.actions.length; x++) {
        let component = properties.actions[ x ];
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-default");
        btn.innerText = component.label;
        contentFooter.appendChild(btn);
        this.buttons.push(btn);
        btn.addEventListener("click", function (evt) {
          this._clicked(evt.srcElement);
        }.bind(this), false);
      }
    }

    this.titleNode = modalTitle;

    this.setVisible(properties.visible);
    this.setTitle(properties.title);

    return div;
  }

  _clicked(btn){
    let index = this.buttons.indexOf(btn);
    let a = this.properties.actions[ index ];
    if (a.validate == true){
      let invalidCount = 0;
      for (let n=0; n<this.components.length; n++) {
        let c = this.components[ n ];
        if (!c.isValid()) {
          invalidCount++;
        }
      }
      if (invalidCount > 0) {
        this._setValid("Invalid dialog")

      } else {
        this.fireAction(a.action);
      }
    } else {
      this.fireAction(a.action);
    }
  }

  _setValid(validationError){
    this.dialogValidatoonNode.innerText = validationError;
    this.dialogValidatoonNode.style.display = validationError ? "block" :"none";
  }

  setTitle(title){
    this.titleNode.innerText = title;
  }

  setVisible(open){
    this.open = open == true;
    this.dialogNode.style.display = this.open ? "block" : "none";
    document.body.setAttribute("class", this.open ? "modal-open" : "");
  }

  stateChanged(state, value) {
    // TODO State references should be variables
    if (state == this.properties.states.visible) {
      this.setVisible(value);
    } else if (state == this.properties.states.title) {
      this.setTitle(value);
    }
  }
}
