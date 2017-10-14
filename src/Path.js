/**
 *
 *
 */
export class Path {

  constructor(properties) {
    this.params = Path._parse(properties);
  }

  getLength() {
    return this.params.length;
  }

  /**
   * Returns true if the path matches the pattern
   * @param path the path
   */
  matches(path) {
    console.info("Path: ", path);
    let arr = Path._parse(path);
    if (arr.length !== this.params.length){
      return false;
    }
    for (let x = 0; x < arr.length; x++) {
      let p1 = this.params[x]; // {variable}
      let p2 = arr[x]; // real
      if (!this.isVariable(p1) && p1 !== p2) {
        return false;
      }
    }

    return true;
  }

  isVariable(value) {
    return Path.getVariable(value) !== undefined;
  }

  /**
   * Returns the variable name if used - otherwise undefined
   * @param value
   * @returns {string}
   */
  static getVariable(value) {
    if (value === undefined) {
      return;
    }
    if (value.indexOf("{") === 0 && value.indexOf("}") === value.length - 1) {
      return value.substring(1, value.length - 1);
    }
  }

  get(variableName) {
    return this.variableMap[variableName];
  }

  parse(path) {
    let arr = Path._parse(path);
    let m = {};
    for (let x = 0; x < this.params.length; x++) {
      let key = this.params[x];
      let val = arr[x];
      let variableName = Path.getVariable(key);
      if (variableName !== undefined) {
        m[variableName] = val;
      }
    }
    this.variableMap = m;
    return m;
  }

  static _parse(path) {
    if (typeof path !== "string") {
      return undefined;
    }
    let arr = path.split("/");
    arr[0] = "/";
    if (arr[ arr.length-1 ] === ""){
      arr.pop();
    }
    return arr;
  }

}
