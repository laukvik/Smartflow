import {InputComponent} from "../component";

export class Datepicker extends InputComponent {
  constructor(properties) {
    super(properties);
    this.rootNode = document.createElement("div");

    this.input = document.createElement("input");
    this.input.setAttribute("type", "text");
    this.input.setAttribute("class", "form-control");
    this.input.setAttribute("placeholder", "hh:mm:ss");

  }

  buildCalendar(month, year) {
    let d2 = new Date();
    d2.setUTCHours(0);
    d2.setUTCFullYear(year);
    d2.setUTCMonth(month);
    d2.setUTCDate(1);
    const weekdayStart = d2.getDay();
    const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    const months = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
    // Month
    let thead = document.createElement("thead");
    let trMonth = document.createElement("tr");
    trMonth.setAttribute("class", "sf-datepicker__month");
    let trMonthTH = document.createElement("th");
    trMonthTH.setAttribute("colspan", "7");
    trMonthTH.innerText = "" + months[month];
    trMonth.appendChild(trMonthTH);
    // Weekdays
    let trDays = document.createElement("tr");
    trDays.setAttribute("class", "sf-datepicker__weekdays");
    for (let x = 0; x < 7; x++) {
      let trDaysTD = document.createElement("th");
      trDaysTD.innerText = "" + days[x].substr(0,2);
      trDays.appendChild(trDaysTD);
    }
    thead.appendChild(trMonth);
    thead.appendChild(trDays);
    // Body
    let tbody = document.createElement("tbody");
    for (let y = 0; y < 6; y++) {
      let tr = document.createElement("tr");
      var addRow = true;
      for (let x = 0; x < 7; x++) {
        let index = y * 7 + x;
        let dayIndex = index - weekdayStart + 1;
        let d = new Date();
        d.setUTCHours(0);
        d.setUTCFullYear(year);
        d.setUTCMonth(month);
        d.setUTCDate(dayIndex);
        let now = new Date();
        let v = d.getUTCDate();
        let td = document.createElement("td");
        td.innerText = "" + v;
        let strValue = d.getUTCFullYear() + "-" + d.getUTCMonth() + "-" + d.getUTCDate();
        td.setAttribute("data-calendar-day", strValue);
        td.addEventListener("click", function () {
          this._selectedDay(td)
        }.bind(this, false));
        tr.appendChild(td);
        let isToday = now.getUTCDate() === d.getUTCDate();
        let isPreviousMonth = d.getUTCMonth() < month;
        let isNextMonth = d.getUTCMonth() > month;
        let otherMonth = !(d.getUTCMonth() === month);
        let isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
        let isDisabled = false;
        td.setAttribute("class", (isDisabled ? " disabled": "") + (isToday? " today":"") + (otherMonth ? " othermonth": "") + (isWeekend ? " weekend":""));
        if (x == 0 && isNextMonth){
          addRow = false;
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
    return table;
  }

  _selectedDay(day){
    var data = day.getAttribute("data-calendar-day");
    var arr = data.split("-");
    let d = new Date();
    d.setUTCFullYear(arr[0]);
    d.setUTCMonth(arr[1]);
    d.setUTCDate(arr[2]);
    this.input.value = data;
    this.fireState(this.stateValue, d);
  }

  buildComponent(builder, properties){
    this.stateValue = properties.states.value;
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
    addonAfter.setAttribute("class", "input-group-addon");
    let iconAfter = document.createElement("span");
    iconAfter.setAttribute("class", "glyphicon glyphicon-calendar");
    addonAfter.appendChild(iconAfter);
    this.inputGroup1.appendChild(addonAfter);

    this.setRequired(properties.required);
    this.setLabel(properties.label);

    this.removeChildNodes(this.inputGroup2);
    this.inputGroup2.appendChild(this.buildCalendar(7,2017));

    return this.rootNode;
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.input.removeAttribute("disabled");
    } else {
      this.input.setAttribute("disabled", "true");
    }
  }

  setText(text) {
    this.textNode.textContent = text;
  }

  getText() {
    return this.textNode.textContent;
  }

  stateChanged(state, value) {
    if (state == this.properties.states.value) {
      //this.setText(value);
    } else if (state == this.properties.states.enabled) {
      this.setEnabled(value);
    } else if (state == this.properties.states.label) {
      this.setLabel(value);
    }
  }
}

