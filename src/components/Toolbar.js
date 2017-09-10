/**
 * Progress
 *
 * Properties:
 * - value
 *
 */
class Toolbar extends SmartflowComponent {
  constructor(properties, ctrl, builder) {
    super(properties, ctrl, builder);
    this.buildRoot("sf-toolbar");
    this.buttons = [];

    var toolbarNode = document.createElement("div");
    toolbarNode.setAttribute("class", "btn-toolbar");
    toolbarNode.setAttribute("role", "toolbar");

    this.getElement().appendChild(toolbarNode);

    var groupNode = document.createElement("div");
    groupNode.setAttribute("class", "btn-group");
    toolbarNode.appendChild(groupNode);

    if (Array.isArray(properties.actions)) {
      for (var x=0; x<properties.actions.length; x++) {
        var component = properties.actions[ x ];

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
  }

  _clicked(btn){
    var index = this.buttons.indexOf(btn);
    var a = this.properties.actions[ index ];
    this.fireAction(a.action);
  }

  stateChanged(state, value) {
    if (state == this.properties.states.value) {
    }
  }
}

