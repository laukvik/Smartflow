import {PresentationComponent} from "../PresentationComponent";

export class Navbar extends PresentationComponent {

  constructor(properties) {
    super(properties);
    this.buttons = [];
    this.actions = [];
    this.createComponentNode("nav", "Navigation", "navbar navbar-toggleable-md navbar-light bg-faded");
    this._expanded = false;
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === 'expanded') {
      this.setExpanded(value);
    }
  }

  setVisible(visible) {
    this._componentVisible = visible === true;
    this._componentNode.style.display = this._componentVisible ? "block" : "none";
  }

  setExpanded(expanded){
    this._expanded = expanded === true;
    if (this._expanded) {
      this.buttonNode.setAttribute("class", "navbar-toggler navbar-toggler-right");
      this.collapseNode.setAttribute("class", "navbar-collapse collapse show");
    } else {
      this.buttonNode.setAttribute("class", "navbar-toggler navbar-toggler-right collapsed");
      this.collapseNode.setAttribute("class", "navbar-collapse collapse");
    }
  }

  toggleExpanded(){
    this.setExpanded(!this._expanded);
  }

  /**
   *
   *
   * <button class="navbar-toggler navbar-toggler-right"
   * type="button"
   * data-toggle="collapse"
   * data-target="#navbarSupportedContent"
   * aria-controls="navbarSupportedContent"
   * aria-expanded="false" aria-label="Toggle navigation">
   * @param builder
   * @param properties
   * @returns {Element|*}
   */
  buildComponent(builder, properties) {
    this._componentNode.setAttribute("class", "navbar navbar-toggleable-md navbar-light bg-faded");

    let button = document.createElement("button");
    this.buttonNode = button;
    button.setAttribute("class", "navbar-toggler navbar-toggler-right");
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Toggle navigation");
    button.addEventListener("click", function () {
      this.toggleExpanded();
    }.bind(this), false);

    // Button
    let toggler = document.createElement("span");
    toggler.setAttribute("class", "navbar-toggler-icon");
    button.appendChild(toggler);
    this._componentNode.appendChild(button);

    // Brand
    let brand = document.createElement("a");
    brand.setAttribute("class", "navbar-brand");
    brand.innerText = properties.label;
    this._componentNode.appendChild(brand);

    let div = document.createElement("div");
    this.collapseNode = div;
    div.setAttribute("class", "collapse navbar-collapse");
    let ul = document.createElement("ul");
    ul.setAttribute("class", "navbar-nav mr-auto");

    // Build buttons
    if (Array.isArray(properties.buttons)) {
      let buttons = properties.buttons;

      for (let x = 0; x < buttons.length; x++) {
        let btn = buttons[x];

        let li = document.createElement("li");
        li.setAttribute("class", "nav-item");
        let a = document.createElement("a");
        a.setAttribute("class", "nav-link"+ (btn.enabled == false ? " disabled" : ""));
        a.innerText = btn.label;
        if (btn.enabled == false) {
          a.setAttribute("disabled", false);
        }

        a.addEventListener("click", function () {
          this._clicked(btn.action);
        }.bind(this), false);

        li.appendChild(a);
        ul.appendChild(li);
      }
    }
    this._componentNode.appendChild(div);
    div.appendChild(ul);
    return this._componentNode;
  }

  _clicked(action) {
    this.setExpanded(false);
    if (action !== undefined){
      this.fireAction(action);
    }
  }
}

