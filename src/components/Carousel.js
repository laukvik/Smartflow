import {PresentationComponent} from "../PresentationComponent";

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
    this.nextIconNode.addEventListener("click", this.nextIndex.bind(this) );
    this.prevIconNode.addEventListener("click", this.prevIndex.bind(this) );
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
    } else {
      console.warn("Carousel: Unknown property ", name);
    }
  }

  prevIndex(){
    this.setIndex(this._index - 1);
  }

  nextIndex(){
    this.setIndex(this._index + 1);
  }

  setIndex(index){
    console.info("index: ", index);
    if (this._index < this._itemNodes.length){
      this.setItemVisible(this._index, false);
    }
    this._index = index > -1 && index < this._itemNodes.length ? index : 0;
    if (this._index < this._itemNodes.length){
      this.setItemVisible(this._index, true);
    }
  }

  setItemVisible(index, active){
    console.info("setItemVisible: ", index, active);
    this._itemNodes[ index ].setAttribute("class", "carousel-item" + (active === true ? " active" : ""));
  }

  setItems(items){
    console.info("Items: ", items);
    this._itemNodes = [];
    this.removeChildNodes(this.carouselInnerNode);
    this.removeChildNodes(this.carouselIndicatorsNode);

    if (Array.isArray(items)) {
      items.forEach(item => {

        // Carousel item
        const carouselItem = document.createElement("div");
        carouselItem.setAttribute("class", "carousel-item");
        this._itemNodes.push(carouselItem);

        const img = document.createElement("img");
        img.setAttribute("class", "d-block w-100");
        carouselItem.appendChild(img);
        img.setAttribute("src", item["posterurl"]);

        const captionNode = document.createElement("div");
        captionNode.setAttribute("class", "carousel-caption d-none d-md-block");

        const titleNode = document.createElement("h3");
        titleNode.innerText = item["title"];
        const descNode = document.createElement("p");
        descNode.innerText = item["storyline"];

        carouselItem.appendChild(captionNode);
        captionNode.appendChild(titleNode);
        captionNode.appendChild(descNode);

        this.carouselInnerNode.appendChild(carouselItem);

        // Indicators
        const li = this.createElement("li");
        li.setAttribute("data-slide-to", "1");
        this.carouselIndicatorsNode.appendChild(li);

      });
    }
    this.setIndex(1);
  }

}
