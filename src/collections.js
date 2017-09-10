class Collections {
  constructor(properties) {
    this.setSort(properties.sort);
    this.setPaging(properties.paging);
    this.setFilter(properties.filter);
  }

  setFilter(filter){
    if (Array.isArray(filter)){
      this.filter = filter;
      this.filterEnabled = (filter !== undefined);
    } else {
      this.filter = [];
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

  setSort(sort){
    if (sort === undefined) {
      this.sortMatch = undefined;
      this.sortOrder = undefined;
    } else {
      this.sortMatch = sort.match;
      this.sortOrder = sort.order;
    }
    this.sortEnabled = sort === undefined;
  }

  find(items) {

    // Filter
    var filter = this.filter;
    var collectionFilter = function (item) {
      var count = 0;
      for (var x = 0; x < filter.length; x++) {
        var f = filter[x];
        var filterMatch = f['match'];
        var filterType = f['type'];
        var filterValue = f['value'];
        var value = item[filterMatch];
        if (filterType === 'eq') {
          if (value === filterValue) {
            count++;
          }
        } else if (filterType === 'contains') {
          if (Array.isArray(value)) {
            var found = false;
            for (var y = 0; y < value.length; y++) {
              if (value[y].toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                count++;
              }
            }
            if (found) {
              count++;
            }
          } else {
            if (value.toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
              count++;
            }
          }
        }
      }
      return count === filter.length;
    };

    // Sorting
    var matchColumn = this.sortMatch;
    var negOrder = this.sortOrder === 'asc' ? -1 : 1;
    var posOrder = this.sortOrder === 'asc' ? 1 : -1;

    var collectionSorter = function (a, b) {
      var nameA = a[matchColumn];
      var nameB = b[matchColumn];
      if (nameA < nameB) {
        return negOrder;
      }
      if (nameA > nameB) {
        return posOrder;
      }
      return 0;
    };

    // Paging
    var paging = function (items, page, size) {
      var startIndex = page * size;
      var endIndex = startIndex + size;
      return items.slice(startIndex, endIndex);
    };

    var rows = items;
    if (this.filterEnabled) {
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
