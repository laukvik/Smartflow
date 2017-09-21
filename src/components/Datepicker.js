import {InputComponent} from "../component";
import {Formatter} from "../formatter";

export class Datepicker extends InputComponent {
  constructor(properties) {
    super(properties);
    this.rootNode = document.createElement("div");
    this.input = document.createElement("input");
    this.input.setAttribute("type", "text");
    this.input.setAttribute("class", "form-control");
    this.previousButton = document.createElement("button");
    this.previousButton.setAttribute("class", "btn btn-default btn-xs");
    let prevIcon = document.createElement("span");
    prevIcon.setAttribute("class", "glyphicon glyphicon-menu-left");
    prevIcon.setAttribute("aria-hidden", "true");
    this.previousButton.appendChild(prevIcon);
    this.nextButton = document.createElement("button");
    this.nextButton.setAttribute("class", "btn btn-default btn-xs");
    let nextIcon = document.createElement("span");
    nextIcon.setAttribute("class", "glyphicon glyphicon-menu-right");
    nextIcon.setAttribute("aria-hidden", "true");
    this.nextButton.appendChild(nextIcon);

    // TODO - Remove i18n for days
    this.dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    // TODO - Remove i18n for months
    this.monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
    this.formatter = new Formatter();

    this.startsWithMonday = true;
    this.dateFormat = "YYYY.MM.DD";
    this.selectedDate = undefined;
    this.year = new Date().getUTCFullYear();
    this.month = new Date().getUTCMonth();
    this.pickerVisible = false;
  }

  setValue(value) {
    let date = this.formatter.parse(value, this.dateFormat);
    console.info("setValue: ", value, date);
    this.setDate(date);
  }

  setDate(value){
    if (value == undefined){
      return;
    }
    this.selectedDate = value;
    this.month = this.selectedDate.getUTCMonth();
    this.year = this.selectedDate.getUTCFullYear();

    console.info("setDate: ", value, this.month, this.year);

    this.input.value = this.formatter.formatDate(this.selectedDate, this.dateFormat);
    this._rebuildCalendar();
  }

  _setPickerVisible(visible){
    this.pickerVisible = visible == true;
    this.inputGroup2.setAttribute("class", this.pickerVisible ? "sf-datepicker__visible" : "sf-datepicker__hidden")
  }

  static isSameDate(date1, date2){
    if (date1 == undefined || date2 == undefined) {
      return false;
    }
    return date1.getUTCDate() === date2.getUTCDate()
      && date1.getUTCFullYear() === date2.getUTCFullYear()
      && date1.getUTCMonth() === date2.getUTCMonth();
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
    trMonth.setAttribute("class", "sf-datepicker__month");

    let trMonthTH_left = document.createElement("th");
    trMonthTH_left.appendChild(this.previousButton);
    trMonthTH_left.addEventListener("click", function(){
      this.previousMonth();
    }.bind(this, false));

    let trMonthTH_right = document.createElement("th");
    trMonthTH_right.appendChild(this.nextButton);
    trMonthTH_right.addEventListener("click", function(){
      this.nextMonth();
    }.bind(this, false));

    let trMonthTH = document.createElement("th");
    trMonthTH.setAttribute("colspan", "5");
    trMonthTH.innerText = "" + this._getMonthName(month) + " " + this.year;

    trMonth.appendChild(trMonthTH_left);
    trMonth.appendChild(trMonthTH);
    trMonth.appendChild(trMonthTH_right);


    // Weekdays
    let trDays = document.createElement("tr");
    trDays.setAttribute("class", "sf-datepicker__weekdays");
    for (let x = 0; x < 7; x++) {
      let trDaysTD = document.createElement("th");
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

        td.setAttribute("data-sf-datepicker-millis", d.getTime() + "");
        td.addEventListener("click", function () {
          this._selectedDay(td)
        }.bind(this, false));
        tr.appendChild(td);

        let isToday = Datepicker.isSameDate(d, new Date());
        let isSelected = Datepicker.isSameDate(d, this.selectedDate);
        let isNextMonth = d.getUTCMonth() > month;
        let otherMonth = !(d.getUTCMonth() === month);
        let isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
        let isDisabled = false;
        td.setAttribute("class",
          (isSelected ? " active": "") +
          (isDisabled ? " disabled": "") +
          (isToday? " today":"") +
          (otherMonth ? " othermonth": "") +
          (isWeekend ? " weekend":""));
        if (x == 0 && isNextMonth){
          //addRow = false;
        }
      }
      if (addRow){
        tbody.appendChild(tr);
      }
    }
    let table = document.createElement("table");
    table.setAttribute("class", "sf-datepicker");
    table.appendChild(thead);
    table.appendChild(tbody);
    this.inputGroup2.style.position = "static";
    return table;
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

  _selectedDay(day){
    let data = day.getAttribute("data-sf-datepicker-millis");
    let d = new Date();
    d.setTime(parseInt(data));
    console.info("_selectedDay: ", d, data);
    let formattedValue = this.formatter.formatDate(d, this.dateFormat);
    this.setDate(d);
    this.fireState(this.stateValue, formattedValue);
    this._setPickerVisible(false);
  }

  buildComponent(builder, properties){
    if (properties.states) {
      this.stateValue = properties.states.value;
    }
    if (properties.id){
      this.rootNode.setAttribute("id", properties.id);
    }
    this.rootNode.setAttribute("class", "sf-datepicker" + (properties.class ? " " + properties.class : ""));
    this.inputGroup1 = document.createElement("div");
    this.inputGroup1.appendChild(this.input);
    this.inputGroup1.setAttribute("class", "input-group");
    this.inputGroup2 = document.createElement("div");
    this.rootNode.appendChild(this.inputGroup1);
    this.rootNode.appendChild(this.inputGroup2);
    let addonAfter = document.createElement("span");
    addonAfter.setAttribute("class", "input-group-addon btn");
    let iconAfter = document.createElement("span");
    iconAfter.setAttribute("class", "glyphicon glyphicon-calendar");
    addonAfter.appendChild(iconAfter);
    addonAfter.addEventListener("click", function () {
      this._togglePickerVisible();
    }.bind(this, false));
    this.inputGroup1.appendChild(addonAfter);
    this.setRequired(properties.required);
    this.setLabel(properties.label);
    this.removeChildNodes(this.inputGroup2);
    this._rebuildCalendar();
    this.input.setAttribute("placeholder", this.dateFormat);
    this._setPickerVisible(false);
    this.setValue(properties.value);
    return this.rootNode;
  }

  _togglePickerVisible(){
    this._setPickerVisible(!this.pickerVisible);
  }

  _rebuildCalendar(){
    this.removeChildNodes(this.inputGroup2);
    this.inputGroup2.appendChild(this.buildCalendar(this.month, this.year));
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.input.removeAttribute("disabled");
    } else {
      this.input.setAttribute("disabled", "true");
    }
  }

  stateChanged(state, value) {
    if (state == this.properties.states.value) {
      this.setValue(value);
    } else if (state == this.properties.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.properties.states.label) {
      this.setLabel(value);
    }
  }
}

