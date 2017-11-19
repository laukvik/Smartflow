import {PresentationComponent} from "../PresentationComponent";
import {Collection} from "../Collection";

export class Media extends PresentationComponent {

  constructor() {
    super();
    this.collections = new Collection();
    this.buttons = [];
    this.actions = [];
    this.components = [];
    this.createComponentNode("div");
    this.getComponentNode().setAttribute("class", "media");

    this.photoNode = document.createElement("img");
    this.photoNode.setAttribute("class", "d-flex mr-3");

    let mediaBody = document.createElement("div");
    mediaBody.setAttribute("class", "media-body");
    this.titleNode = document.createElement("h5");
    this.titleNode.setAttribute("class", "mt-0");
    this.descriptionNode = document.createElement("p");

    this.getComponentNode().appendChild(this.photoNode);
    this.getComponentNode().appendChild(mediaBody);
    mediaBody.appendChild(this.titleNode);
    mediaBody.appendChild(this.descriptionNode);
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === "title") {
      this.setTitle(value);
    } else if (name === "photo") {
      this.setPhoto(value);
    } else if (name === "description") {
      this.setDescription(value);
    } else {
      console.warn("Media: Unknown property ", name);
    }
  }

  setTitle(title) {
    this.titleNode.innerText = title;
  }

  setPhoto(url) {
    this.photoNode.setAttribute("src", url);
  }

  setDescription(description) {
    this.descriptionNode.innerText = description;
  }


}
