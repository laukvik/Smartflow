import {PresentationComponent} from "../PresentationComponent";

export const NavbarBackground = {
  PRIMARY: "bg-primary",
  SECONDARY: "bg-secondary",
  SUCCESS: "bg-success",
  DANGER: "bg-danger",
  WARNING: "bg-warning",
  INFO: "bg-info",
  DARK: "bg-dark",
  LIGHT: "bg-light"
};

export const NavbarColor = {
  DARK: "navbar-dark",
  LIGHT: "navbar-light"
};

export const NavbarPlacement = {
  FIXED_TOP: "fixed-top",
  FIXED_BOTTOM: "fixed-bottom",
};

export class Navbar extends PresentationComponent {

  constructor() {
    super();

    this._buttons = [];
    this._actions = [];
    this._selectedIndex = -1;

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
    this.setExpanded(false)
  }

  setColor(color){
    this._color = color;
    this._updateClass();
  }

  setBackground(background){
    this._background = background;
    this._updateClass();
  }

  _updateClass() {
    this.getComponentNode().setAttribute("class", "navbar navbar-toggleable-md "
      + (this._color ? " " + this._color : "")
      + (this._background ? " " + this._background : "")
      + (this._placement ? " " + this._placement : ""));
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === 'expanded') {
      this.setExpanded(value);
    } else if (name === 'color') {
      this.setColor(value);
    } else if (name === 'background') {
      this.setBackground(value);
    } else if (name === 'buttons') {
      this.setButtons(value);
    } else if (name === 'title') {
      this.setLabel(value);
    } else if (name === "selectedIndex"){
       this.setSelectedIndex(value);
    } else if (name === "placement"){
      this.setPlacement(value);
    } else {
      console.warn("Navbar: Unknown property ", name);
    }
  }

  setSelectedIndex(value) {
    this._selectedIndex = typeof value === "number" ? value : -1;
    this._selectedIndex = value;
    let index = 0;
    this._buttons.forEach(b => {
      b.setAttribute("class", "nav-item" + (this._selectedIndex === index ? " active" : ""));
      index++;
    })
  }

  setPlacement(placement){
    this._placement = placement;
  }

  setLabel(title){
    this._brandNode.innerText = title;
  }

  setButtons(buttons){
    this._buttons = [];
    this._actions = [];
    if (Array.isArray(buttons)) {
      let index = 0;
      buttons.forEach(btn => {
        let li = document.createElement("li");
        this._buttons.push(li);
        li.setAttribute("class", "nav-item");
        li.setAttribute("data-nav-item-index", index + "");
        let a = document.createElement("a");
        a.setAttribute("class", "nav-link"+ (btn.enabled === false ? " disabled" : ""));
        a.innerText = btn.label;
        this._actions.push(btn.action);

        if (btn.enabled === false) {
          a.setAttribute("disabled", "false");
        }
        a.addEventListener("click", this.clickHandler.bind(this) );
        li.appendChild(a);
        this.ul.appendChild(li);
        index++;
      })
    }
  }

  clickHandler(evt){
    const li = evt.srcElement.parentElement;
    const index = parseInt( li.getAttribute("data-nav-item-index") );
    this.setSelectedIndex(index);
    this.setExpanded(false);
    if (this._actions[index] !== undefined){
      this.fireAction(this._actions[index]);
    }
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

}

