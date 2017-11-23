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
    console.info("Arr: ", arr);
    if (arr.length === 0) {
      return json;
    }
    return Query.findByArray(arr, json);
  }

  static findByArray(arr, json) {
    let current = json;
    let x = 0;
    arr.forEach(a => {
      current = current[arr[x]];
      if (!current) {
        return;
      }
      x++;
    });
    return current;
  }

}
