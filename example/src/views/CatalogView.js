/**
 * The first page
 *
 *
 */
import {View} from "../../../src/View";
import {Items} from "../../../src/components/Items";
import {Text} from "../../../src/components/Text";
import {Table} from "../../../src/components/Table";
import {Radio} from "../../../src/components/Radio";

/**
 * Table view with details of all movies in catalog.
 * Custom renderer with photo component.
 * Paging.
 *
 */
export class CatalogView extends View {

  constructor() {
    super();

    this.smartflow = {
      "path": "/catalog",
      "components": [
        {
          "type": Text,
          "heading": "Catalog",
          "text": "All movies"
        },
        {
          "type": Radio,
          "label": "View",
          "selected": "{global:listView}",
          "itemKey": "key",
          "itemLabel": "label",
          "items": [
            {
              "label": "Poster",
              "key": "false"
            },
            {
              "label": "List",
              "key": "true"
            }
          ]
        },
        {
          "type": Table,
          "visible": "{global:listView}",
          "columns": [
            {
              "label": "Title",
              "key": "title"
            },
            {
              "label": "Genre",
              "key": "genres"
            },
            {
              "label": "Year",
              "key": "year"
            },
          ],
          "items": "{global:movies}"
        },

        {
          "type": Items,
          "items": "{global:movies}",
          "visible": "{global:listView}",
          "component": {
            "type": "Card",
            "title": "title",
            "description": "storyline",
            "photo": "poster"
          },
          "sort": {
            "match": "title",
            "order": "asc"
          },
          "filter":
            {
              "match": "storyline",
              "type": "contains",
              "value": "{filter}"
            }
          ,
          "paging": {
            "size": 10,
            "page": 0
          }
        }
      ]
    };
  }

}
