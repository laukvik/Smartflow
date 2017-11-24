import {View} from "../../../src/View";
import {Card} from "../../../src/components/Card";
import {Button, ButtonStyle} from "../../../src/components/Button";
import {Alert, AlertStyle} from "../../../src/components/Alert";
import {Link} from "../../../src/components/Link";
import {List} from "../../../src/components/List";
import {Media} from "../../../src/components/Media";
import {Carousel} from "../../../src/components/Carousel";
import {PhotoOfTheDayAction} from "../actions/PhotoOfTheDayAction";

export class PresentationExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/presentation",
      "components": [
        {
          "type": Carousel,
          "items": "{global:gallery/items}",
          "title": "title",
          "description": "/social/og:description",
          "url": "https://yourshot.nationalgeographic.com",
          "photo": "/sizes/800",
          "index": 3,
          "components": [
          ]
        },
        {
          "type": Alert,
          "alertStyle": AlertStyle.DANGER,
          "text": "Warning! Something dangerous happened.",
        },
        {
          "type": Card,
          "title": "Card title",
          "description": "Lorem ipsum sit amet",
          "button":             {
            "type": Button,
            "label": "Primary",
            "buttonStyle": ButtonStyle.PRIMARY
          }
        },

        {
          "type": Link,
          "label": "Link title",
          "url": "http://www.google.com",
        },
        {
          "type": List,
          "label": "Link title",
          "url": "http://www.google.com",
        },

        {
          "type": Media,
          "title": "Media heading",
          "description": "Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.",
          "photo": "https://images-na.ssl-images-amazon.com/images/M/MV5BODMwM2M4ZmItMzk4Ny00YTBhLTkyN2EtYTAzMmIwNjMxNjQxL2ltYWdlXkEyXkFqcGdeQXVyMTk0NTY2ODQ@._V1_SX203_CR0,0,203,300_AL_.jpg",
        },





      ]
    };
  }

  viewInitialized() {
    this.runAction(new PhotoOfTheDayAction());
  }

}
