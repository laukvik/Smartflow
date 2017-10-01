class HtmlBuilder {

  append(){
    return new Div();
  }
}

class Div extends Tag{

}


class Tag {
  constructor(){}
  attr(){
  }
}

//
// new HtmlBuilder()
//   .append("card")
