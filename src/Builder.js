/**
 * Builds components in a controller based on declarations
 * as specified in the controller.
 *
 * @param ctrl
 * @constructor
 */
import {Scope, SCOPES} from "./Scope";

export class Builder {

  static buildComponentByProperties(properties, view){
    let c = new properties.type();
    c.setView(view);
    view.mapBinding(c);
    for (let key in properties) {
      if (key !== "type") { // Type is reserved
        let value = properties[key];
        let bind = Scope.parseScope(value);
        if (bind.scope === SCOPES.NONE) {
          c.setProperty(key, bind.value);
        } else {
          c.setBinding(key, bind.value, bind.scope);
        }
      }
    }
    return c;
  }

  static buildComponentsByProperties(arrayProperties, view){
    let compArray = [];
    for (let x=0; x<arrayProperties.length; x++) {
      let props = arrayProperties[x];
      compArray.push(this.buildComponentByProperties(props, view));
    }
    return compArray;
  }

}

