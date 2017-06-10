function AddressbookView() {
    this.viewInitialized = function (app) {
        //console.info("AddressbookView.viewInitialized: ");
    };
    this.viewEnabled = function (app) {
        //console.info("AddressbookView.viewEnabled: ", app.getPath());
    };
    this.viewDisabled = function (app) {
        //console.info("AddressbookView.viewDisabled: ", app.getPath());
    };
    this.pathChanged = function (app) {
        //console.info("AddressbookView.pathChanged: ", app.getPath());
    };
    this.stateChanged = function (state) {
        //console.info("AddressbookView.stateChanged: ", state);
        if (state.name == "addressbook"){
            this.update(state.value);
        }
    };
    this.update = function(data){
        var el = document.getElementById("addressbookRows");
        var html = "";
        for (var y=0; y<data.length; y++){
            var row = data[ y ];
            html += '<tr><td><input type="checkbox"></td><td>'+ row.first +'</td><td>'+ row.first +'</td><td>'+ row.first +'</td></tr>';
        }
        el.innerHTML = html;
    };
}

module.exports = AddressbookView;