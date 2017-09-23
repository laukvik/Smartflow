export class Collections {
  constructor(properties) {
    this.clearFilter();
    this.setSort(properties.sort);
    this.setPaging(properties.paging);
    this.setFilter(properties._filters);
  }

  clearFilter(){
    this._filters = [];
  }
  clearSort(){
  }
  clearPaging(){
  }

  _addFilter(key, value, compareType) {
    this._filters.push(
      {
        "match": key,
        "type": compareType,
        "value": value
      }
    );
  }

  addKey(key, value) {
    this._addFilter(key, value, "equals");
  }

  addEquals(key, value) {
    this._addFilter(key, value, "eq");
  }

  addContains(key, value) {
    this._addFilter(key, value, "contains");
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
    if (paging == undefined) {
      this.pageSize = undefined;
      this.pageIndex = undefined;
    } else {
      this.pageSize = paging.size;
      this.pageIndex = paging.page;
    }
    this.pageEnabled = this.pageSize != undefined;
  }

  setSort(sort){
    if (sort == undefined) {
      this.sortMatch = undefined;
      this.sortOrder = undefined;
    } else {
      this.sortMatch = sort.match;
      this.sortOrder = sort.order;
    }
    this.sortEnabled = sort == undefined;
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

        //console.info("Filter: ", this._filters);

        if (filterType === 'eq') {
          if (value === filterValue) {
            count++;
          }
        } else if (filterType === 'contains') {
          if (Array.isArray(value)) {
            for (let y = 0; y < value.length; y++) {
              if (value[y].toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
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
        }
      }
      return count === filter.length;
    };

    // Sorting
    let matchColumn = this.sortMatch;
    let negOrder = this.sortOrder === 'asc' ? -1 : 1;
    let posOrder = this.sortOrder === 'asc' ? 1 : -1;

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
    if (this.sortEnabled) {
      rows = rows.sort(collectionSorter);
    }
    if (this.pageEnabled) {
      rows = paging(rows, this.pageIndex, this.pageSize);
    }
    return rows;
  }

}
