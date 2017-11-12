/**
 * Toolbar with links to index, catalog, posters and a add movie button
 *
 */
import {View} from "../../../src/View";
import {GotoSearchAction} from "../actions/GotoSearchAction";
import {GotoCatalogAction} from "../actions/GotoCatalogAction";
import {GotoNewMovieAction} from "../actions/GotoNewMovieAction";
import {GotoPresentationExamplesAction} from "../actions/GotoPresentationAction";
import {GotoInputExamplesAction} from "../actions/GotoInputExamplesAction";
import {GotoTableExamplesAction} from "../actions/GotoTableExamplesAction";
import {GotoItemsExamplesAction} from "../actions/GotoItemsExamplesAction";
import {GotoProgressExamplesAction} from "../actions/GotoProgressExamplesAction";
import {GotoDialogsExamplesAction} from "../actions/GotoDialogsExamplesAction";
import {NavbarStyle} from "../../../src/components/Navbar";
import {GotoButtonExamplesAction} from "../actions/GotoButtonExamplesAction";

export class NavigationView extends View {

  constructor() {
    super();

    this.smartflow = {
      "components": [
        {
          "type": "Navbar",
          "title": "Smartflow",
          "navbarStyle": NavbarStyle.LIGHT,
          "buttons": [
            {
              "label": "Input",
              "action": GotoInputExamplesAction
            },
            {
              "label": "Presentation",
              "action": GotoPresentationExamplesAction
            },
            {
              "label": "Table",
              "action": GotoTableExamplesAction
            },
            {
              "label": "Items",
              "action": GotoItemsExamplesAction
            },
            {
              "label": "Progress",
              "action": GotoProgressExamplesAction
            },
            {
              "label": "Dialogs",
              "action": GotoDialogsExamplesAction
            },
            {
              "label": "Buttons",
              "action": GotoButtonExamplesAction
            },
            // {
            //   "label": "Search",
            //   "action": GotoSearchAction
            // },
            // {
            //   "label": "Catalog",
            //   "action": GotoCatalogAction
            // },
            // {
            //   "label": "New...",
            //   "action": GotoNewMovieAction
            // }
          ]
        }
      ]
    };
  }

}
