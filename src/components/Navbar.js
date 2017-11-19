import {PresentationComponent} from "../PresentationComponent";

export const NavbarStyle = {
  DARK: "bg-dark",
  LIGHT: "bg-light"
};

export class Navbar extends PresentationComponent {

  constructor() {
    super();

    this.buttons = [];
    this.actions = [];

    // Build elements
    this.createComponentNode('nav');
    this.buttonNode = document.createElement("button");
    this.buttonNode.setAttribute("class", "navbar-toggler navbar-toggler-right");
    this.buttonNode.setAttribute("type", "button");
    this.buttonNode.setAttribute("data-toggle", "collapse");
    this.buttonNode.setAttribute("aria-expanded", "false");
    this.buttonNode.setAttribute("aria-label", "Toggle navigation");
    this.buttonNode.addEventListener("click", function () {
      this.toggleExpanded();
    }.bind(this), false);

    // Button
    let togglerIcon = document.createElement("span");
    togglerIcon.setAttribute("class", "navbar-toggler-icon");
    this.buttonNode.appendChild(togglerIcon);
    this.getComponentNode().appendChild(this.buttonNode);

    // Brand
    this._brandNode = document.createElement("a");
    this._brandNode.setAttribute("class", "navbar-brand");
    this.getComponentNode().appendChild(this._brandNode);

    /*************************************************************/
    let div = document.createElement("div");
    this.collapseNode = div;
    div.setAttribute("class", "collapse navbar-collapse");
    this.ul = document.createElement("ul");
    this.ul.setAttribute("class", "navbar-nav mr-auto");


    this.getComponentNode().appendChild(div);
    div.appendChild(this.ul);
    /******************************************************/

    // this._expanded = false;
    this.setExpanded(false)
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === 'expanded') {
      this.setExpanded(value);
    } else if (name === 'navbarStyle') {
      this.setNavbarStyle(value);
    } else if (name === 'buttons'){
      this.setButtons(value);
    } else if (name === 'title'){
      this.setLabel(value);
    } else {
      console.warn("Navbar: Unknown property ", name);
    }
  }

  setLabel(title){
    this._brandNode.innerText = title;
  }

  setButtons(buttons){
    if (Array.isArray(buttons)) {
      for (let x = 0; x < buttons.length; x++) {
        let btn = buttons[x];
        let li = document.createElement("li");
        li.setAttribute("class", "nav-item");
        let a = document.createElement("a");
        a.setAttribute("class", "nav-link"+ (btn.enabled === false ? " disabled" : ""));
        // a.setAttribute("href", "#" + new btn.action().getSmartflow().path);
        // console.info("Button: ", );
        a.innerText = btn.label;
        if (btn.enabled === false) {
          a.setAttribute("disabled", false);
        }
        a.addEventListener("click", function () {
          this._clicked(btn.action);
        }.bind(this), false);

        li.appendChild(a);
        this.ul.appendChild(li);
      }
    }
  }

  setNavbarStyle(navbarStyle) {
    this.getComponentNode().setAttribute("class", "navbar navbar-toggleable-md navbar-light " + (navbarStyle ? " " + navbarStyle : ""));
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
   * @returns {Element|*}
   */
  buildComponent(builder) {
    return this.getComponentNode();
  }

  _clicked(action) {
    this.setExpanded(false);
    if (action !== undefined){
      this.fireAction(action);
    }
  }
}

