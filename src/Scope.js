/**
 *
 */
export class Scope {

  /**
   * Returns an array of all scopes in the string
   *
   * @param value
   * @returns {string}
   */
  static findScopes(value){
    let newValue = "";
    let afterStart = false;
    let variable = "";
    let scopesArr = [];
    for (let x=0; x<value.length; x++) {
      let c = value.charAt(x);
      if (c === '{') {
        if (afterStart) {
          variable = "{";
        }
        afterStart = true;
        variable = "{";
      } else if (c === '}' && afterStart) {
        variable += c;
        scopesArr.push(Scope.parseScope(variable));
        variable = "";
      } else if (afterStart) {
        variable += c;
      } else {
        newValue += c;
      }
    }
    return scopesArr;
  }

  static parseScope(value) {
    let isString = typeof value === 'string';
    if (!isString) {
      return {
        "scope": SCOPES.NONE,
        "value": value
      }
    }
    if (value.indexOf("{") === 0 && value.lastIndexOf("}") === value.length - 1) {
      let innerValue = value.substring(1, value.length - 1);
      if (innerValue.toUpperCase().startsWith(SCOPES.GLOBAL)) {
        return {
          "scope": SCOPES.GLOBAL,
          "value": innerValue.substring(7)
        }
      } else {
        return {
          "scope": SCOPES.VIEW,
          "value": innerValue
        }
      }
    }
    return {
      "scope": SCOPES.NONE,
      "value": value
    }
  }

}


export const SCOPES = {
  NONE: "NONE",
  VIEW: "VIEW",
  GLOBAL: "GLOBAL"
};
