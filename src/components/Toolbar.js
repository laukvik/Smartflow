/**
 * Toolbar
 *
 * Properties:
 * - visible
 * - enabled
 */
export default class Toolbar extends InputComponent {
  constructor(properties) {
    super(properties);
    this.buttons = [];
  }

  buildComponent(builder){
    var toolbarNode = document.createElement("div");
    toolbarNode.setAttribute("class", "btn-toolbar");
    toolbarNode.setAttribute("role", "toolbar");

    var groupNode = document.createElement("div");
    groupNode.setAttribute("class", "btn-group");
    toolbarNode.appendChild(groupNode);

    if (Array.isArray(this.properties.actions)) {
      for (var x=0; x<this.properties.actions.length; x++) {
        var component = this.properties.actions[ x ];

        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-default");
        btn.innerText = component.label;
        groupNode.appendChild(btn);
        this.buttons.push(btn);

        btn.addEventListener("click", function (evt) {
          this._clicked(evt.srcElement);
        }.bind(this), false);

      }
    }
    return toolbarNode;
  }

  _clicked(btn){
    var index = this.buttons.indexOf(btn);
    var a = this.properties.actions[ index ];
    this.fireAction(a.action);
  }

  stateChanged(state, value) {
    if (state == this.properties.states.visible) {

    } else if (state == this.properties.states.enabled) {

    }
  }
}

