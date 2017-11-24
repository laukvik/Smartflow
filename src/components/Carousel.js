import {PresentationComponent} from "../PresentationComponent";
import {Query} from "../Query";

/**
 * Carousel
 *
 * https://getbootstrap.com/docs/4.0/components/carousel/
 *
 */
export class Carousel extends PresentationComponent {

  constructor() {
    super();
    this._itemNodes = [];
    this._index = 0;
    this.createComponentNode("div");
    this.getComponentNode().setAttribute("class", "carousel slide");
    this.getComponentNode().setAttribute("data-ride", "carousel");
    this.carouselInnerNode = document.createElement("div");
    this.carouselInnerNode.setAttribute("class", "carousel-inner");
    this.carouselIndicatorsNode = this.createElement("ol", "carousel-indicators");
    this.prevNode = this.createElement("a", "carousel-control-prev", "button");
    this.prevNode.setAttribute("data-slide", "prev");
    this.prevIconNode = this.createElement("span", "carousel-control-prev-icon", "button");
    this.prevIconNode.setAttribute("aria-hidden", "true");
    this.prevTextNode = this.createElement("span", "sr-only");
    this.prevTextNode.innerText = "Previous";
    this.prevNode.appendChild(this.prevIconNode);
    this.prevNode.appendChild(this.prevTextNode);
    this.nextNode = this.createElement("a", "carousel-control-next", "button");
    this.nextNode.setAttribute("data-slide", "next");
    this.nextIconNode = this.createElement("span", "carousel-control-next-icon", "button");
    this.nextIconNode.setAttribute("aria-hidden", "true");
    this.nextTextNode = this.createElement("span", "sr-only");
    this.nextTextNode.innerText = "Next";
    this.nextNode.appendChild(this.nextIconNode);
    this.nextNode.appendChild(this.nextTextNode);
    this.nextNode.addEventListener("click", this.nextIndex.bind(this) );
    this.prevNode.addEventListener("click", this.prevIndex.bind(this) );
    this.getComponentNode().appendChild(this.carouselIndicatorsNode);
    this.getComponentNode().appendChild(this.carouselInnerNode);
    this.getComponentNode().appendChild(this.prevNode);
    this.getComponentNode().appendChild(this.nextNode);
    this.setIndex(0);
  }

  createElement(elementName, className, roleName){
    const element = document.createElement(elementName);
    if (className){
      element.setAttribute("class", className);
    }
    if (roleName){
      element.setAttribute("role", roleName);
    }
    return element;
  }

  setProperty(name, value) {
    if (name === "visible") {
      this.setVisible(value);
    } else if (name === "items") {
      this.setItems(value);
    } else if (name === "index") {
      this.setIndex(value);
    } else if (name === "title") {
      this.setTitle(value);
    } else if (name === "description") {
      this.setDescription(value);
    } else if (name === "photo") {
      this.setPhoto(value);
    } else if (name === "url") {
      this.setUrl(value);
    } else {
      console.warn("Carousel: Unknown property ", name);
    }
  }

  setTitle(title){
    this._title = title;
  }

  setDescription(description){
    this._description = description;
  }

  setPhoto(photo){
    this._photo = photo;
  }

  setUrl(url){
    this._url = url;
  }

  prevIndex(){
    this.setIndex(this._index - 1);
  }

  nextIndex(){
    this.setIndex(this._index + 1);
  }

  setIndex(index){
    if (this._index < this._itemNodes.length){
      this.setItemVisible(this._index, false);
    }
    this._index = index > -1 && index < this._itemNodes.length ? index : 0;
    if (this._index < this._itemNodes.length){
      this.setItemVisible(this._index, true);
    }
  }

  setItemVisible(index, active){
    this._itemNodes[ index ].setAttribute("class", "carousel-item" + (active === true ? " active" : ""));
    this.carouselIndicators[ index ].setAttribute("class", (active === true ? "active" : ""));
  }

  setItems(items){
    this._itemNodes = [];
    this.carouselIndicators = [];
    this.removeChildNodes(this.carouselInnerNode);
    this.removeChildNodes(this.carouselIndicatorsNode);
    if (Array.isArray(items)) {
      let itemIndex = -1;
      items.forEach(item => {
        itemIndex++;

        // Carousel item
        const carouselItem = document.createElement("div");
        carouselItem.setAttribute("class", "carousel-item");
        this._itemNodes.push(carouselItem);

        const img = document.createElement("img");
        img.setAttribute("class", "d-block w-100");
        carouselItem.appendChild(img);
        // Photo
        img.setAttribute("src", this._url + Query.find(this._photo, item));

        const captionNode = document.createElement("div");
        captionNode.setAttribute("class", "carousel-caption d-none d-md-block");

        const titleNode = document.createElement("h3");
        titleNode.innerText = item[this._title];
        const descNode = document.createElement("p");
        descNode.innerHTML = Query.find(this._description, item);

        carouselItem.appendChild(captionNode);
        captionNode.appendChild(titleNode);
        captionNode.appendChild(descNode);

        this.carouselInnerNode.appendChild(carouselItem);

        // Indicators
        const li = this.createElement("li");
        li.setAttribute("data-slide-to", "" + itemIndex);
        li.addEventListener("click", this.clicked.bind(this));
        this.carouselIndicators.push(li);
        this.carouselIndicatorsNode.appendChild(li);
      });
    }
    this.setIndex(1);
  }

  clicked(evt){
    const li = evt.srcElement;
    const index = li.getAttribute("data-slide-to");
    this.setIndex(index);
  }

}
