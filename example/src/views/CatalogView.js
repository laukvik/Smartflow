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
import {Tabs} from "../../../src/components/Tabs";

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
          "label": "Year",
          "selected": "{view:selectedYear}",
          "itemKey": "year",
          "itemLabel": "year",
          "items": "{global:movies}",
          "distinct": "year",
          "sort": {
            "match": "title",
            "order": "asc"
          }
        },

        {
          "type": Radio,
          "label": "Rating",
          "selected": "{view:selectedRating}",
          "itemKey": "contentRating",
          "itemLabel": "contentRating",
          "items": "{global:movies}",
          "distinct": "contentRating",
          "sort": {
            "match": "contentRating",
            "order": "asc"
          }
        },

        {
          "type": Tabs,
          "index": 0,
          "tabs": [
            {
              "label": "Posters",
              "components": [
                {
                  "type": Table,
                  "columns": [
                    {
                      "label": "Poster",
                      "key": "title",
                      "component": {
                        "type": Photo,
                        "url": "{posterurl}",
                        "width": "100"
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
                  "filter":
                    {
                      "match": "year",
                      "type": "is",
                      "value": "{view:selectedYear}"
                    }
                  ,
                  "sort": {
                    "match": "title",
                    "order": "asc"
                  },

                }
              ]
            },
            {
              "label": "List",
              "components": [
                {
                  "type": Items,
                  "items": "{global:movies}",
                  "component": {
                    "type": Card,
                    "title": "title",
                    "description": "storyline"
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
            }
          ]
        },


      ]
    };
  }

}
