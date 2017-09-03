/**
 * Formats a String
 *
 * @param config
 * @constructor
 */
class Formatter {
  constructor(config){
    this.config = config;
    this._DATEFORMAT = 'YYYY.MM.DD';
    this._TIMEFORMAT = 'hh:mm:ss';
  }
  _leadingZero(v, padding) {
    var value = '' + v; // 1
    var remaining = padding - value.length; // 3 - 1
    for (var x=0; x<remaining; x++) {
      value = '0' + value;
    }
    return value;
  };
  formatDate(value, format) {
    if (value === undefined){
      return '';
    }
    if (format === undefined){
      return '';
    }
    var s = format;
    s = s.replace('YYYY', value.getFullYear(), 4);
    s = s.replace('Y', this._leadingZero(value.getFullYear()) );
    s = s.replace('MM', this._leadingZero(value.getMonth(), 2) );
    s = s.replace('M', value.getMonth());
    s = s.replace('DD', this._leadingZero(value.getDate(), 2) );
    s = s.replace('D', value.getDate());

    s = s.replace('hh',this._leadingZero(value.getHours(), 2));
    s = s.replace('h',value.getHours());
    s = s.replace('mm',this._leadingZero(value.getMinutes(), 2));
    s = s.replace('m',value.getMinutes());
    s = s.replace('ss',this._leadingZero(value.getSeconds(), 2));
    s = s.replace('s',value.getSeconds());

    s = s.replace('SSS',this._leadingZero(value.getMilliseconds(), 3));
    s = s.replace('S',value.getMilliseconds());

    return s;
  };
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
    var sValue = value.toString();

    var hasFractionValue = sValue.indexOf('.') > -1;

    var intV = '';
    var fraV = '';

    // Find the values separate
    if (hasFractionValue) {
      var arr = sValue.split(".");
      intV = arr[0];
      fraV = arr[1];
    } else {
      intV = sValue;
    }

    var intFormat;
    var fraFormat;

    var hasFractionFormat = format.indexOf('.') > - 1;

    // Find the format separate
    if (hasFractionFormat) {
      var arrFormat = format.split(".");
      intFormat = arrFormat[0];
      fraFormat = arrFormat[1];
    } else {
      intFormat = format;
    }

    // Build integer format
    var intString = "";
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
    var fraString = '';
    if (hasFractionFormat) {
      for (var x=0; x<fraFormat.length; x++) {
        var f = fraFormat[ x ];
        var v = x < fraV.length ? fraV[ x ] : 0;
        fraString += (f === '0'|| f === '#' ? v : f);
      }
    }

    return (hasFractionFormat) ? (intString + '.' + fraString) : intString;
  };
  formatJson(key, json) {
    if (key === undefined) {
      return '???undefined???';
    }
    var s = this.config[key];

    for (var k in json){
      var val = json[k];
      s = s.replace( '{' + k + '}', val );
    }
    return s;
  };
  format(key, keys) {
    if (key === undefined) {
      return undefined;
    }
    var value = this.config[key];
    if (value === undefined) {
      return "???" + key + "???";
    }
    if (keys === undefined) {
      return value;
    }
    var arr = [];
    if (Array.isArray(keys)) {
      arr = keys;
    } else {
      arr[0] = keys;
    }
    var s = value;
    for (var x = 0; x < arr.length; x++) {
      var symbol = "{" + x + "}";
      s = s.replace(symbol, arr[x]);
    }
    return s;
  };
}


