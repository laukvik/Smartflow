/**
 * Formats a String
 *
 * @param config
 * @constructor
 * @private
 */
export class Formatter {
  constructor(config){
    this.config = config;
    this._DATEFORMAT = 'YYYY.MM.DD';
    this._TIMEFORMAT = 'hh:mm:ss';
    this.dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    this.monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
    this.setStartsWithMonday(true);
  }

  setStartsWithMonday(isMonday){
    this.startsWithMonday = isMonday;
  }

  formatDay(index) {
    if (index >= 0 && index <= 6) {
      if (this.startsWithMonday) {
        return this.dayNames[ index == 6 ? 0 : (index+1) ];
      } else {
        return this.dayNames[ index ];
      }
    }
  }

  formatMonth(index) {
    if (index >= 0 && index <= 11) {
      return this.monthNames[ index ];
    }
  }

  /**
   *
   * @param value string date
   * @param key YYYY
   * @param pattern YYYY.MM.DD
   * @private
   */
  _extract(value, key, pattern) {
    if (value == undefined || key == undefined || pattern == undefined || value == "" || key == "" || pattern == "") {
      return;
    }
    let index = pattern.indexOf(key);
    if (index < 0) {
      return;
    }
    return value.substring(index, index+key.length);
  }
  parse(value, format) {
    if (value == undefined || format == undefined || value == "" || format == "") {
      return;
    }
    let year = this._extract(value, "YYYY", format);
    let month = this._extract(value, "MM", format);
    let date = this._extract(value, "DD", format);

    if (year == undefined || month == undefined || date == undefined) {
      return;
    }

    if (year == "" || month == "" || date == "") {
      return;
    }

    let d = new Date();
    d.setUTCFullYear(year);
    d.setUTCMonth(month-1);
    d.setUTCDate(date);
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    return d;
  }
  _leadingZero(v, padding) {
    let value = '' + v; // 1
    let remaining = padding - value.length; // 3 - 1
    for (let x=0; x<remaining; x++) {
      value = '0' + value;
    }
    return value;
  }
  formatDate(value, format) {
    if (value === undefined || format === undefined || value === null || format === null) {
      return;
    }

    if (!(value instanceof Date)) {
      return;
    }



    let s = format;
    s = s.replace('YYYY', this._leadingZero( value.getUTCFullYear(), 4));
    s = s.replace('Y', this._leadingZero(value.getUTCFullYear()) );
    s = s.replace('MM', this._leadingZero(value.getUTCMonth()+1, 2) );
    s = s.replace('M', value.getUTCMonth()+1);
    s = s.replace('DD', this._leadingZero(value.getUTCDate(), 2) );
    s = s.replace('D', value.getUTCDate());

    s = s.replace('hh',this._leadingZero(value.getUTCHours(), 2));
    s = s.replace('h',value.getUTCHours());
    s = s.replace('mm',this._leadingZero(value.getUTCMinutes(), 2));
    s = s.replace('m',value.getUTCMinutes());
    s = s.replace('ss',this._leadingZero(value.getUTCSeconds(), 2));
    s = s.replace('s',value.getUTCSeconds());

    s = s.replace('SSS',this._leadingZero(value.getUTCMilliseconds(), 3));
    s = s.replace('S',value.getUTCMilliseconds());

    return s;
  }
  /**
   *
   * #,###,###,##0.00
   *
   * 0 - Må være tall
   * # - Valgfri
   *
   * @param value
   * @param format
   * @returns {string}
   */
  formatNumber(value, format) {
    if (isNaN(value - parseFloat(value))) {
      return undefined;
    }
    const sValue = value.toString();

    const hasFractionValue = sValue.indexOf('.') > -1;

    let intV = '';
    let fraV = '';

    // Find the values separate
    if (hasFractionValue) {
      const arr = sValue.split(".");
      intV = arr[0];
      fraV = arr[1];
    } else {
      intV = sValue;
    }

    let intFormat;
    let fraFormat;

    const hasFractionFormat = format.indexOf('.') > -1;

    // Find the format separate
    if (hasFractionFormat) {
      const arrFormat = format.split(".");
      intFormat = arrFormat[0];
      fraFormat = arrFormat[1];
    } else {
      intFormat = format;
    }

    // Build integer format
    let intString = "";
    for (var x=0; x<intFormat.length; x++) {
      // The format
      var f = intFormat[ intFormat.length - x - 1 ];
      // The value
      var v = x < intV.length ? intV[ intV.length - x - 1 ] : -1;

      if (v > -1){
        intString = ((f === '#' || f === '0') ? v : f) + intString;
      } else {
        x = intFormat.length;
      }
    }

    // Build fraction format
    let fraString = '';
    if (hasFractionFormat) {
      for (let x=0; x<fraFormat.length; x++) {
        let f = fraFormat[ x ];
        let v = x < fraV.length ? fraV[ x ] : 0;
        fraString += (f === '0'|| f === '#' ? v : f);
      }
    }
    return (hasFractionFormat) ? (intString + '.' + fraString) : intString;
  };
  formatJson(key, json) {
    if (key === undefined) {
      return '???undefined???';
    }
    let s = this.config[key]
    for (let k in json){
      let val = json[k];
      s = s.replace( '{' + k + '}', val );
    }
    return s;
  };
  format(key, keys) {
    if (key === undefined) {
      return undefined;
    }
    const value = this.config[key];
    if (value === undefined) {
      return "???" + key + "???";
    }
    if (keys === undefined) {
      return value;
    }
    let arr = [];
    if (Array.isArray(keys)) {
      arr = keys;
    } else {
      arr[0] = keys;
    }
    let s = value;
    for (let x = 0; x < arr.length; x++) {
      const symbol = "{" + x + "}";
      s = s.replace(symbol, arr[x]);
    }
    return s;
  };
}


