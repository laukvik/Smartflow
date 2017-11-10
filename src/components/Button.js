import {Component} from "../Component";

export const ButtonStyle = {
  PRIMARY: "btn-primary",
  SECONDARY: "btn-secondary",
  INFO: "btn-info",
  DANGER: "btn-danger",
  SUCCESS: "btn-success",
  WARNING: "btn-warning"
};

export const ButtonSize = {
  SMALL: "btn-sm",
  LARGE: "btn-lg",
  DEFAULT: "",
};

export const BadgeStyle = {
  PRIMARY: "badge-primary",
  SECONDARY: "badge-secondary",
  SUCCESS: "badge-success",
  DANGER: "badge-danger",
  WARNING: "badge-warning",
  INFO: "badge-info",
  LIGHT: "badge-light",
  DARK: "badge-dark"
};

export const BadgeShape = {
  NORMAL: "",
  ROUND: "badge-pill",
};

export const Outline = {
  PRIMARY: "btn-outline-primary",
  SECONDARY: "btn-outline-secondary",
  SUCCESS: "btn-outline-success",
  DANGER: "btn-outline-danger",
  WARNING: "btn-outline-warning",
  INFO: "btn-outline-info",
  LIGHT: "btn-outline-light",
  DARK: "btn-outline-dark"
};

/**
 * Buttton for triggering action
 *
 * https://getbootstrap.com/docs/4.0/components/buttons/
 *
 * @example
 * {
 * "type": Button,
 * "label": "Notifications",
 * "style": ButtonStyle.PRIMARY,
 * "badge": 4,
 * "badgeStyle": BadgeStyle.LIGHT,
 * "action": GotoMovieAction
 * }
 */
export class Button extends Component {

  constructor(properties) {
    super(properties);
    this._size = null;
    this._active = false;
    this._style = null;
    this._outline = null;
    this._badgeShape = null;
    this._textNode = document.createElement("span");
    this._spaceNode = document.createTextNode(" ");
    this._badgeNode = document.createElement("span");

    this.createComponentNode("button");
    this.getComponentNode().setAttribute("class", "btn");
    this.getComponentNode().setAttribute("role", "button");

    this._badgeNode.setAttribute("class", "badge");
    this._componentNode.appendChild(this._textNode);
    this._componentNode.appendChild(this._spaceNode);

    this._componentNode.addEventListener("click", function () {
      this._clicked();
    }.bind(this), false);
  }

  _updateClass(){
    this._componentNode.setAttribute("class", "btn" + (!this._size ? "" : " " + this._size) + (!this._style ? "" : " " + this._style) + (!this._outline ? "" : " " + this._outline) + (this._active === true ? " active":"") );
  }

  /**
   *
   * @returns {*}
   */
  render(){
    return this.getComponentNode();
  }

  setProperty(name, value) {
    if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "label") {
      this.setLabel(value);
    } else if (name === "buttonStyle") {
      this.setButtonStyle(value);
    } else if (name === "badge") {
      this.setBadge(value);
    } else if (name === "badgeStyle") {
      this.setBadgeStyle(value);
    } else if (name === "badgeShape") {
      this.setBadgeShape(value);
    } else if (name === "action") {
      this.action = value;
    } else if (name === "active") {
      this.setActive(value);
    } else if (name === "size") {
      this.setSize(value);
    } else if (name === "outline") {
      this.setOutline(value);
    }
  }

  setOutline(outline){
    this._outline = outline;
    this._updateClass();
  }

  setBadgeShape(badgeShape){
    if (!Object.values(BadgeShape).includes(badgeShape)){
      console.warn("Button: Illegal badgeShape", badgeShape);
      return;
    }
    this._badgeShape = badgeShape;
    this._updateBadgeClass();
  }

  setButtonStyle(style){
    this._style = style;
    this._updateClass();
  }

  setSize(size){
    this._size = size;
    this._updateClass();
  }

  setActive(isActive){
    this._active = isActive === true;
    this.getComponentNode().setAttribute("aria-pressed", this._active ? "true" : "false");
    this._updateClass();
  }

  setLabel(text) {
    this._textNode.textContent = text;
  }

  setBadge(badge){
    this._badgeNode.textContent = badge;
    if (!badge){
      this._componentNode.removeChild(this._badgeNode);
    } else {
      if (!this._componentNode.contains(this._badgeNode)) {
        this._componentNode.appendChild(this._badgeNode);
      }
    }
  }

  setBadgeStyle(badgeStyle){
    this._badgeStyle = badgeStyle;
    this._updateBadgeClass();
  }

  _updateBadgeClass(){
    this._badgeNode.setAttribute("class", "badge" + (this._badgeStyle ? " " + this._badgeStyle : "") + (this._badgeShape ? " " + this._badgeShape : ""));
  }


  buildComponent(builder, properties) {
    return this._componentNode;
  }

  _clicked() {
    if (this.action !== undefined) {
      this.fireAction(this.action);
    }
  }

  setEnabled(isEnabled) {
    if (isEnabled == true) {
      this._componentNode.removeAttribute("disabled");
    } else if (isEnabled == false){
      this._componentNode.setAttribute("disabled", "true");
    }
  }


}
