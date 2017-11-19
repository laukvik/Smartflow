
export const SCOPES = {
  NONE: "NONE",
  COMPONENT: "COMPONENT",
  VIEW: "VIEW",
  GLOBAL: "GLOBAL"
};

/**
 * Specifies what scope to find data.
 *
 * Global Scope     value: "{global:stateName}"
 * View Scope       value: "{view:stateName}"
 * Component Scope  value: "{stateName}"
 * No scope         value: ""
 *
 *
 */
export class Scope {

  /**
   * Replaces all occurrences of the scope with the value
   *
   * @param scope the scope
   * @param value the value to replace
   */
  static replace(scope, value, replacer) {
    return value.replace(scope.original, replacer);
  }

  /**
   * Returns an array of all scopes in the string
   *
   * @param value
   * @returns {string}
   */
  static findScopes(value){
    let afterStart = false;
    let variable = "";
    let scopesArr = [];
    for (let x=0; x<value.length; x++) {
      let c = value.charAt(x);
      if (c === '{') {
        if (afterStart) {
          console.warn("Scope: ");
        }
        afterStart = true;
        variable = "{";
      } else if (c === '}' && afterStart) {
        variable += c;
        scopesArr.push(Scope.parseScope(variable));
        variable = "";
        afterStart = false;
      } else if (afterStart) {
        variable += c;
      }
    }
    return scopesArr;
  }

  static parseScope(value) {
    let isString = typeof value === 'string';
    if (!isString) {
      return {
        "scope": SCOPES.NONE,
        "value": value,
        "original": value
      }
    }
    if (value.indexOf("{") === 0 && value.lastIndexOf("}") === value.length - 1) {
      let innerValue = value.substring(1, value.length - 1);
      let index = innerValue.indexOf(":");
      if (index > -1) {
        let scopeName = innerValue.substring(0, index );
        for (let s in SCOPES) {
          if (s === scopeName.toUpperCase()) {
            return {
              "scope": s,
              "value": innerValue.substring(index+1),
              "original": value
            }
          }
        }
      }
      return {
        "scope": SCOPES.COMPONENT,
        "value": innerValue,
        "original": value
      }
    }

    return {
      "scope": SCOPES.NONE,
      "value": value,
      "original": value
    }
  }

}
