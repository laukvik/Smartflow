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
import {Card} from "../../../src/components/Card";
import {Photo} from "../../../src/components/Photo";

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
          "selected": "{view:isListView}",
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
          "visible": "{view:isListView}",
          "columns": [
            {
              "label": "Poster",
              "key": "title",
              "component": {
                "type": Photo,
                "url": "posterurl"
              }
            },
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
            }
          ],
          "items": "{global:movies}",
          "sort": {
            "match": "title",
            "order": "asc"
          },
        },

        {
          "type": Items,
          "items": "{global:movies}",
          "visible": "{view:isListView}",
          "component": {
            "type": Card,
            "title": "title",
            "description": "storyline",
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
