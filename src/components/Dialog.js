import {PresentationComponent} from "../component";

export class Dialog extends PresentationComponent {
  constructor(properties) {
    super(properties);
    this.buttons = [];
    this.actions = [];
    this.components = [];
    this._componentNode = document.createElement("div");
  }

  setProperties(properties) {
    this.setVisible(properties.visible);
    this.setTitle(properties.title);
  }

  buildComponent(builder, properties) {
    this.properties = properties;
    this.dialogValidatoonNode = document.createElement("div");
    this.dialogValidatoonNode.setAttribute("class", "alert alert-warning alert-dismissible");
    this.dialogValidatoonNode.style.display = "none";
    //this.dialogNode = div;
    this._componentNode.setAttribute("tabindex", "-1");
    this._componentNode.setAttribute("role", "dialog");
    this._componentNode.setAttribute("class", "modal fade in");
    let dialog = document.createElement("div");
    this._componentNode.setAttribute("role", "document");
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
    this._componentNode.appendChild(dialog);
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
        let componentInstance = builder.buildChildNode(panelNode, panelComponent);
        this.components.push(componentInstance);
      }
    }
    if (Array.isArray(properties.actions)) {
      for (let x = 0; x < properties.actions.length; x++) {
        let component = properties.actions[x];
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-default");
        btn.innerText = component.label;
        contentFooter.appendChild(btn);
        this.buttons.push(btn);
        this.actions.push(component);
        btn.addEventListener("click", function (evt) {
          this._clicked(evt.srcElement, component);
        }.bind(this), false);
      }
    }
    this.titleNode = modalTitle;
    this._componentNode.setAttribute("class", "sf-dialog" + (properties.class ? " " + properties.class : ""));
    return this._componentNode;
  }

  _clicked(btn) {
    let index = this.buttons.indexOf(btn);
    let a = this.actions[index];
    if (a.validate === true) {
      let invalidCount = 0;
      for (let n = 0; n < this.components.length; n++) {
        let c = this.components[n];
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

  _setValid(validationError) {
    this.dialogValidatoonNode.innerText = validationError;
    this.dialogValidatoonNode.style.display = validationError ? "block" : "none";
  }

  setTitle(title) {
    this.titleNode.innerText = title;
  }

  setVisible(open) {
    this.open = open == true;
    this._componentNode.style.display = this.open ? "block" : "none";
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
