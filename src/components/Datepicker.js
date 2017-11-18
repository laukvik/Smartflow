import {InputComponent} from "../InputComponent";
import {Formatter} from "../Formatter";
import {Collection} from "../Collection";

export class Datepicker extends InputComponent {

  constructor(properties) {
    super(properties);
    this.getComponentNode().style.position = "relative";
    this._inputNode = document.createElement("input");
    this._inputNode.setAttribute("type", "text");
    this._inputNode.setAttribute("class", "form-control");

    this._dropdownNode = document.createElement("div");
    this._dropdownNode.style.top = "70px";
    this._dropdownNode.setAttribute("class", "dropdown-menu");
    this.getComponentNode().appendChild(this._dropdownNode);

    this._detailsNode = document.createElement("div");



    this.previousButton = document.createElement("button");
    this.previousButton.setAttribute("class", "btn btn-primary btn-sm btn-block");
    this.previousButton.innerHTML = '&#8249;';
    this.previousButton.setAttribute("style", "font-weight: bold;");

    this.nextButton = document.createElement("button");
    this.nextButton.setAttribute("class", "btn btn-primary btn-sm btn-block");
    this.nextButton.innerHTML = '&#8250;';
    this.nextButton.setAttribute("style", "font-weight: bold;");

    this.openButton = document.createElement("button");
    this.openButton.setAttribute("class", "input-group-addon btn");
    this.openIcon = document.createElement("img");
    this.setIcon(Datepicker.getCalendarIcon());
    this.openButton.appendChild(this.openIcon);
    this.openButton.addEventListener("click", function () {
      this._togglePickerVisible();
    }.bind(this, false));

    this.setDayNames(["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]);
    this.setMonthNames(["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"]);
    this.formatter = new Formatter();

    this.startsWithMonday = true;
    this.setFormat("YYYY-MM-DD");
    this.selectedDate = undefined;
    this.year = new Date().getUTCFullYear();
    this.month = new Date().getUTCMonth();
    this.pickerVisible = false; // TODO - Flytt til data-attribute

    this.collections = new Collection();

    this._rebuildCalendar();
    this.updateInputGroup();
  }

  updateInputGroup(){
    this.removeChildNodes(this.getInputGroup());
    this.getInputGroup().appendChild(this._inputNode);
    this.getInputGroup().appendChild(this.openButton);
  }

  setProperty(name, value) {

    if (name === "label") {
      this.setLabel(value);
    } else if (name === "required") {
      this.setRequired(value);
    } else if (name === "enabled") {
      this.setEnabled(value);
    } else if (name === "help") {
      this.setHelp(value);
    } else if (name === "items") {
      this._unfilteredItems = value;
      this.setItems(value);
      this._rebuildCalendar();
    } else if (name === "value") {
      this.setValue(value);
    } else if (name === "sort") {
      this.setSort(value);
    } else if (name === "filter") {
      this.setFilter(value);
    } else if (name === "itemKey") {
      this.setItemKey(value);
    } else if (name === "itemLabel") {
      this.setItemLabel(value);
    } else if (name === "itemsEmpty") {
      this.setItemsEmpty(value);
    }
  }

  setItemsEmpty(itemsEmpty) {
    this._itemsEmpty = itemsEmpty;
  }

  setItemKey(itemKey) {
    this._itemKey = itemKey;
  }

  setItemLabel(itemLabel) {
    this._itemLabel = itemLabel;
  }

  setSort(sort) {
    this.collections.setSort(sort);
  }

  setFilter(filter) {
    if (Array.isArray(filter)) {
      this.collections.setFilter(filter);
    } else {
      this.filter = [];
    }
  }

  setItems(items) {
    if (Array.isArray(items)) {
      this._items = this.collections.find(items);
    }
  }

  findItemsByValue(value){
    this.collections.clearFilter();
    this.collections.addEquals(this._itemKey, value);
    return this.collections.find(this._unfilteredItems);
  }

  setDetails(items){
    this.removeChildNodes(this._detailsNode);
    let ul = document.createElement("ul");
    ul.setAttribute("class", "list-group");
    this._detailsNode.appendChild(ul);
    if (Array.isArray(items)){
      for (let x=0; x<items.length; x++) {
        const item = items[x];
        let li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        li.innerText = item[ "title" ];
        ul.appendChild(li);
      }
    }
  }

  setIcon(){
    this.openIcon.setAttribute("src", Datepicker.getCalendarIcon());
  }

  static getCalendarIcon(){
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGMSURBVDhPtZQ9S8NQGIWDg+DoIg7iIAhSaWnaJmbwBwhdO+lQUBHBVXRx0EmHgpOCiCDoIE4dir/B2V3QwY9BHFTEqfF549twm0RJGzzwcG/OezhJw22sqFzXHSuVSo8wo1aiyuXyDpkrvYyrUqnYhJYIrbDOgs9+nrUmXhR8l7UF9+zH1V9wHGc0KORijUFbipSwFG4MPwR/F4JSqBqzV5iS0mfD9LnbNN4tT++wPpkzgyPYYt6EemR2IO/GNOQpmrZtz7EeR2cdmH2yrkIN7jq+wKwVK83Kv5ee8w4nskLPQ1jK5jA4ChlFj5yGv0u5+yLzzSjkPY10KVUpfuI5hQ2NdClVKbPwH8V+Wwt9foGtkS6lKjVFbl+z12rF1FOp/KfJyIGXbF3tmHoqZd7Q3IvneUNqx5S6tFAojJD50FxD7USlLmW2JxloF4vFSbUT1UupfBrlbC6r9avM0vdgY1kDP6P+lM/nh6ULzqT9RJ/2jVU+sv3yBdJTtXK53CCbdYwLuMzAaVBoWdY34cNuEWVgeSMAAAAASUVORK5CYII=";
  }

  setFormat(dateFormat) {
    this.dateFormat = dateFormat;
  }

  setDayNames(dayNames){
    this.dayNames = dayNames;
  }

  setMonthNames(monthNames){
    this.monthNames = monthNames;
  }


  setValue(value) {
    this.setDate(this.formatter.parse(value, this.dateFormat));
  }

  setDate(value){
    if (value == undefined){
      console.warn("Datepicker: value is undefined");
      return;
    }
    this.selectedDate = value;
    this.month = this.selectedDate.getUTCMonth();
    this.year = this.selectedDate.getUTCFullYear();
    this._inputNode.value = this.formatter.formatDate(this.selectedDate, this.dateFormat);
    this._rebuildCalendar();
  }

  _setPickerVisible(visible){
    this.pickerVisible = visible === true;
    this._dropdownNode.style.display = this.pickerVisible ? "block" : "none";
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this._inputNode.removeAttribute("disabled");
    } else {
      this._inputNode.setAttribute("disabled", "true");
    }
  }

  _getDayName(index){
    if (this.startsWithMonday) {
      if (index === 6){
        return this.dayNames[0];
      }
      return this.dayNames[index+1];
    }
    return this.dayNames[index];
  }

  _getMonthName(index){
    return this.monthNames[index];
  }

  buildCalendar(month, year) {
    let d2 = new Date();
    d2.setUTCHours(0);
    d2.setUTCMinutes(0);
    d2.setUTCSeconds(0);
    d2.setUTCMilliseconds(0);
    d2.setUTCFullYear(year);
    d2.setUTCDate(1);

    // Month
    let thead = document.createElement("thead");
    let trMonth = document.createElement("tr");
    d2.setUTCMonth(month);
    let trMonthTH_left = document.createElement("th");
    trMonthTH_left.appendChild(this.previousButton);
    // trMonthTH_left.style.textAlign = "center";
    trMonthTH_left.addEventListener("click", function(){
      this.previousMonth();
    }.bind(this, false));
    let trMonthTH_right = document.createElement("th");
    trMonthTH_right.appendChild(this.nextButton);
    // trMonthTH_right.style.textAlign = "center";
    trMonthTH_right.addEventListener("click", function(){
      this.nextMonth();
    }.bind(this, false));
    let trMonthTH = document.createElement("th");
    trMonthTH.setAttribute("style", "text-align: center;");
    trMonthTH.setAttribute("colspan", "5");
    trMonthTH.innerText = "" + this._getMonthName(month) + " " + this.year;
    trMonth.appendChild(trMonthTH_left);
    trMonth.appendChild(trMonthTH);
    trMonth.appendChild(trMonthTH_right);

    // Weekdays
    let trDays = document.createElement("tr");
    for (let x = 0; x < 7; x++) {
      let trDaysTD = document.createElement("th");
      trDaysTD.setAttribute("style", "text-align: center; height: 2em;");
      trDaysTD.innerText = "" + this._getDayName(x).substr(0,2);
      trDays.appendChild(trDaysTD);
    }
    thead.appendChild(trMonth);
    thead.appendChild(trDays);

    // Body
    let tbody = document.createElement("tbody");
    for (let y = 0; y < 6; y++) {
      let tr = document.createElement("tr");
      let addRow = true;
      for (let x = 0; x < 7; x++) {
        let d = Datepicker.getDate(x,y, this.month, this.year, this.startsWithMonday);
        let v = d.getUTCDate();
        let td = document.createElement("td");
        td.innerText = "" + v;


        let hasItems = false;
        if (Array.isArray(this._unfilteredItems)){
          let formattedValue = this.formatter.formatDate(d, this.dateFormat);
          let items = this.findItemsByValue(formattedValue);
          hasItems = items.length > 0;
        }

        td.setAttribute("style", "width: 3em; height: 2em; text-align: center; cursor: pointer;" + (hasItems ? " text-decoration: underline;" : ""));
        td.setAttribute("data-sf-datepicker-millis", d.getTime() + "");
        td.addEventListener("click", function () {
          this._selectedDay(td)
        }.bind(this, false));
        td.addEventListener("mouseover", function () {
          this.mouseOver(td)
        }.bind(this, false));
        tr.appendChild(td);

        let isToday = Datepicker.isSameDate(d, new Date());
        let isSelected = Datepicker.isSameDate(d, this.selectedDate);
        let otherMonth = !(d.getUTCMonth() === month);
        let isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
        let isDisabled = false;
        td.setAttribute("class",
          (isSelected ? " active": "") +
          (isDisabled ? " disabled": "") +
          (isToday? " today":"") +
          (otherMonth ? " othermonth": "") +
          (isWeekend ? " weekend":""));
      }
      if (addRow){
        tbody.appendChild(tr);
      }
    }
    const table = document.createElement("table");
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  nextMonth(){
    if (this.month > 10){
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this._rebuildCalendar();
  }

  previousMonth(){
    if (this.month < 0){
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this._rebuildCalendar();
  }

  getDateByTD(day){
    let data = day.getAttribute("data-sf-datepicker-millis");
    let d = new Date();
    d.setTime(parseInt(data));
    return d;
  }

  _selectedDay(day){
    // let data = day.getAttribute("data-sf-datepicker-millis");
    // let d = new Date();
    // d.setTime(parseInt(data));
    // console.info("_selectedDay: ", d, data);
    let d = this.getDateByTD(day);
    let formattedValue = this.formatter.formatDate(d, this.dateFormat);
    this.setDate(d);
    this.firePropertyChanged("value", formattedValue);
    this._setPickerVisible(false);
  }

  mouseOver(day){
    let date = this.getDateByTD(day);
    let formattedValue = this.formatter.formatDate(date, this.dateFormat);
    const items = this.findItemsByValue(formattedValue);
    this.setDetails(items);
  }

  _togglePickerVisible(){
    this._setPickerVisible(!this.pickerVisible);
  }

  _rebuildCalendar(){
    this.removeChildNodes(this._dropdownNode);
    let table = this.buildCalendar(this.month, this.year);
    this._dropdownNode.appendChild(table);
    this._dropdownNode.appendChild(this._detailsNode);
  }

  static getDate(x, y , month, year, startsWithMonday){
    let index = y*7 + x;
    let d = new Date();
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    d.setUTCFullYear(year);
    d.setUTCMonth(month);
    d.setUTCDate(1);
    let weekdayStart = d.getUTCDay();
    if (startsWithMonday && weekdayStart == 0) {
      weekdayStart = 7;
    }
    let dayIndex = index - (weekdayStart-2);
    d.setUTCDate(dayIndex);
    return d;
  }

  static isSameDate(date1, date2){
    if (date1 == undefined || date2 == undefined) {
      return false;
    }
    return date1.getUTCDate() === date2.getUTCDate()
      && date1.getUTCFullYear() === date2.getUTCFullYear()
      && date1.getUTCMonth() === date2.getUTCMonth();
  }

}
