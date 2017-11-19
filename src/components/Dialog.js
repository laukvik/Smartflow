import {PresentationComponent} from "../PresentationComponent";
import {Builder} from "../Builder";

export class Dialog extends PresentationComponent {

  constructor() {
    super();
    this.buttons = [];
    this.actions = [];
    this.components = [];
    this.createComponentNode("div");

    this.getComponentNode().setAttribute("tabindex", "-1");
    this.getComponentNode().setAttribute("role", "dialog");
    this.getComponentNode().setAttribute("class", "modal");

    this.dialogValidatoonNode = document.createElement("div");
    this.dialogValidatoonNode.setAttribute("class", "alert alert-warning alert-dismissible");
    this.dialogValidatoonNode.style.display = "none";

    this.modalDialog = document.createElement("div");
    this.modalDialog.setAttribute("class", "modal-dialog");
    this.modalDialog.setAttribute("role", "document");

    let modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");
    let modalHeader = document.createElement("div");
    modalHeader.setAttribute("class", "modal-header");
    this.contentBody = document.createElement("div");
    this.contentBody.setAttribute("class", "modal-body");
    this.modalTitle = document.createElement("h5");
    modalHeader.appendChild(this.modalTitle);

    this.contentFooter = document.createElement("div");
    this.contentFooter.setAttribute("class", "modal-footer");
    this.getComponentNode().appendChild(this.modalDialog);

    this.modalDialog.appendChild(modalContent);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(this.contentBody);
    modalContent.appendChild(this.contentFooter);
    this.contentBody.appendChild(this.dialogValidatoonNode);
  }

  setProperty(name, value) {
    if (name === "open") {
      this.setOpen(value);
    } else if (name === "title") {
      this.setTitle(value);
    } else if (name === "buttons") {
      this.setButtons(value);
    } else if (name === "components") {
      this.setComponents(value);
    } else {
      console.warn("Dialog: Unknown property ", name);
    }
  }

  setComponents(components){
    if (Array.isArray(components)) {
      this.components = Builder.buildComponentsByProperties(components, this.getView());
      this.components.forEach(b => {
        this.contentBody.appendChild(b.getComponentNode());
      })
    }
  }

  setButtons(buttons){
    if (Array.isArray(buttons)) {
      this.buttons = Builder.buildComponentsByProperties(buttons, this.getView());
      this.removeChildNodes(this.contentFooter);
      this.buttons.forEach(b => {
        this.contentFooter.appendChild(b.getComponentNode());
      })
    }
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
    this.modalTitle.innerText = title;
  }

  setOpen(open) {
    this.open = open === true;
    this.getComponentNode().style.display = this.open ? "block" : "none";
    document.body.setAttribute("class", this.open ? "modal-open" : "");
  }

}
