/**
 * Compare
 *
 * TODO - String
 * TODO - Number
 * TODO - Date
 *
 * @private
 *
 */
export class Collection {

  constructor() {
    this.clearFilter();
    this.clearSort();
    this.clearPaging();
    this.clearDistinct();
  }

  setProperties(properties){
    this.setSort(properties.sort);
    this.setPaging(properties.paging);
    this.setFilter(properties.filters);
    this.setDistinct(properties.distinct);
  }

  clearFilter(){
    this._filters = [];
  }
  clearSort(){
    this._sorting = [];
  }
  clearPaging(){
    this._paging = {};
  }

  clearDistinct(){
    this._distinct = undefined;
  }
  _addFilter(key, value, compareType, datePattern) {
    if (!datePattern) {
      this._filters.push(
        {
          "match": key,
          "type": compareType,
          "value": value
        }
      );
    } else {
      this._filters.push(
        {
          "match": key,
          "type": compareType,
          "value": value,
          "pattern": datePattern
        }
      );
    }
  }

  addAny(key, value, datePattern) {
    this._addFilter(key, value, "any", datePattern);
  }

  addAll(key, value, datePattern) {
    this._addFilter(key, value, "all", datePattern);
  }

  addGreaterThan(key, value, datePattern) {
    this._addFilter(key, value, "gt", datePattern);
  }

  addLessThan(key, value, datePattern) {
    this._addFilter(key, value, "lt", datePattern);
  }

  addEquals(key, value, datePattern) {
    this._addFilter(key, value, "eq", datePattern);
  }

  addContains(key, value, datePattern) {
    this._addFilter(key, value, "contains", datePattern);
  }

  addStartsWith(key, value) {
    this._addFilter(key, value, "startswith");
  }

  setFilter(filter){
    if (Array.isArray(filter)){
      this._filters = filter;
    } else {
      this._filters = [];
    }
  }

  setPaging(paging){
    if (paging === undefined) {
      this.pageSize = undefined;
      this.pageIndex = undefined;
    } else {
      this.pageSize = paging.size;
      this.pageIndex = paging.page;
    }
    this.pageEnabled = this.pageSize !== undefined;
  }

  setDistinct(distinct){
    this._distinct = distinct;
  }

  addSort(key, order) {
    this._sorting.push({"key": key, "order": order});
  }

  /**
   * TODO - Replace use of this method with addSort
   * @param sort
   */
  setSort(sort){
    if (sort === undefined) {
      this._sorting = [];
    } else {
      this.addSort(sort.match, sort.order);
    }
  }

  find(items) {
    // Filter
    let filter = this._filters;
    let collectionFilter = function (item) {
      let count = 0;
      for (let x = 0; x < filter.length; x++) {
        let f = filter[x];
        let filterMatch = f['match'];
        let filterType = f['type'];
        let filterValue = f['value'];
        let value = item[filterMatch];

        if (filterType === 'eq') {
          if (value === filterValue) {
            count++;
          }
        } else if (filterType === 'contains') {
          if (Array.isArray(value)) {
            for (let y in value) {
              if (value[y].indexOf(filterValue) > -1) {
                count++;
              }
            }
          } else {
            if (value.toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
              count++;
            }
          }
        } else if (filterType === 'startswith') {
          if (value.toLowerCase().startsWith(filterValue.toLowerCase())) {
            count++;
          }
        } else if (filterType === 'gt') {
          if (value > filterValue) {
            count++;
          }
        } else if (filterType === 'lt') {
          if (value < filterValue) {
            count++;
          }
        }
      }
      return count === filter.length;
    };

    // Sorting
    let matchColumn;
    let negOrder;
    let posOrder;

    if (this._sorting.length > 0) {
      matchColumn = this._sorting[0].key;
      negOrder = this._sorting[0].order === 'asc' ? -1 : 1;
      posOrder = this._sorting[0].order === 'asc' ? 1 : -1;
    }

    let collectionSorter = function (a, b) {
      let nameA = a[matchColumn];
      let nameB = b[matchColumn];
      if (nameA < nameB) {
        return negOrder;
      }
      if (nameA > nameB) {
        return posOrder;
      }
      return 0;
    };

    // Paging
    let paging = function (items, page, size) {
      let startIndex = page * size;
      let endIndex = startIndex + size;
      return items.slice(startIndex, endIndex);
    };

    let rows = items;

    if (this._filters.length > 0) {
      rows = rows.filter(collectionFilter);
    }

    if (this._distinct !== undefined) {
      let obj = {};
      for (let y=0; y<rows.length; y++) {
        let row = rows[y];
        let v = row[ this._distinct ];
        obj[ v ] = v;
      }
      rows = [];
      for (let o in obj) {
        let row = {};
        row[ this._distinct ] = o;
        rows.push(row);
      }
    }

    if (this._sorting.length > 0) {
      rows = rows.sort(collectionSorter);
    }
    if (this.pageEnabled) {
      rows = paging(rows, this.pageIndex, this.pageSize);
    }
    return rows;
  }

}
