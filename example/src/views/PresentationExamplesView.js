import {View} from "../../../src/View";
import {Searchfield} from "../../../src/components/Searchfield";
import {GotoMovieAction} from "../actions/GotoMovieAction";
import {FindMoviesAction} from "../actions/FindMoviesAction";
import {Card} from "../../../src/components/Card";
import {BadgeShape, BadgeStyle, Button, ButtonSize, ButtonStyle, Outline} from "../../../src/components/Button";
import {Alert, AlertStyle} from "../../../src/components/Alert";
import {Textfield, TextfieldType} from "../../../src/components/Textfield";
import {Radio} from "../../../src/components/Radio";
import {Checkbox} from "../../../src/components/Checkbox";
import {Pulldown} from "../../../src/components/Pulldown";
import {NumberField} from "../../../src/components/NumberField";
import {Datepicker} from "../../../src/components/Datepicker";
import {Dialog} from "../../../src/components/Dialog";
import {Link} from "../../../src/components/Link";
import {Items} from "../../../src/components/Items";
import {List} from "../../../src/components/List";
import {Media} from "../../../src/components/Media";
import {Navbar} from "../../../src/components/Navbar";
import {Photo} from "../../../src/components/Photo";
import {Progress} from "../../../src/components/Progress";
import {Spinner} from "../../../src/components/Spinner";
import {Table} from "../../../src/components/Table";
import {Tabs} from "../../../src/components/Tabs";
import {Toolbar} from "../../../src/components/Toolbar";

export class PresentationExamplesView extends View {

  constructor(properties) {
    super(properties);

    this.smartflow = {
      "path": "/examples/presentation",
      "components": [
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

        // {
        //   "type": Media,
        //   "label": "Link title",
        //   "url": "http://www.google.com",
        // },
        // {
        //   "type": Navbar,
        //   "label": "Link title",
        //   "url": "http://www.google.com",
        // },
        // {
        //   "type": Photo,
        //   "label": "Link title",
        //   "url": "http://www.google.com",
        // },


        // {
        //   "type": Tabs,
        //   "label": "Link title",
        //   "url": "http://www.google.com",
        // },
        // {
        //   "type": Text,
        //   "label": "Link title",
        //   "url": "http://www.google.com",
        // },
        // {
        //   "type": Toolbar,
        //   "label": "Link title",
        //   "url": "http://www.google.com",
        // },
      ]
    };
  }

  viewInitialized() {
  }

}
