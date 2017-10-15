/**
 *
 */
export class Scope {



  parseScope(value) {
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
