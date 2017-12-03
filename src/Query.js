export class Query {

  static find(expression, json){
    if (typeof expression !== "string") {
      return;
    }
    if (expression === "/") {
      return json;
    }
    let arr = expression.split("/");
    arr.shift();
    if (arr.length === 0) {
      return json;
    }
    return Query.findByArray(arr, json);
  }

  static findByArray(arr, json) {
    let current = json;
    arr.forEach(a => {
      current = current[a];
      if (!current) {
        return;
      }
    });
    return current;
  }

}
