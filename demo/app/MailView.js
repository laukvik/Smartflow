function MailView() {
    this.folders = ["inbox", "draft", "sent", "archive", "trash"];
    this.viewInitialized = function(app) {
        this._app = app;
        document.getElementById("mailboxLogoutButton").addEventListener("click", function(){
            app.setPath("/logout");
        });
        document.getElementById("mailboxComposeButton").addEventListener("click", function(){
            app.setPath("/compose");
        });
        document.getElementById("mailboxHelpButton").addEventListener("click", function(){
            app.playTutorial("MailTutorial")
        });
        document.getElementById("mailboxDeleteButton").addEventListener("click", function(){
            app.openDialog("ConfirmDelete",
                {
                    "label": "Delete",
                    "description": "Are you sure you want to delete the selected mails?"
                });
        });

        for (var x = 0; x<this.folders.length; x++) {
            var folder = this.folders[ x ];
            var folderID = folder + "ListItem";
            var folderPath = "/mails/" + folder;
            document.getElementById( folderID ).querySelector("a").setAttribute("data-path", folderPath);
            document.getElementById( folderID ).querySelector("a").addEventListener("click", function(){
                app.setPath(this.getAttribute("data-path"));
            });
        }
    };
    this.pathChanged = function(path) {
        var folder = path.length > 1 ? path[ 1 ] : path[ 0 ];
        this._app.setState( "folder", folder );
    };
    this.stateChanged = function(state) {
        //console.info("MailView.stateChanged: ", state);

        // Badge
        if (this.folders.indexOf(state.name) > -1) {
            this.updateBadge(state.name, state.value.length == 0 ? "" : state.value.length);
        }

        // Preview
        if (state.name == "preview") {
            this.updatePreview(state.value);
        }

        // Left menu high lightning
        if (state.name == "folder") {
            for (var x=0; x<this.folders.length; x++){
                var folder = this.folders[ x ];
                this.updateFolder( folder, state.value == folder);
            }
        }

        if (state.name == "mail-selection") {
            var el = document.getElementById("inboxMailRows");
            var rows = el.getElementsByTagName("INPUT");
            var arr = state.value;
            for (var x=0; x<arr.length; x++){
                var rowIndex = arr[x];
                rows[ rowIndex ].checked = true;
            }

        } else if (state.name == "mails") {

            var el = document.getElementById("inboxMailRows");
            var rows = el.getElementsByTagName("TR");
            rows[ state.value ].style.backgroundColor = "#dddddd";

        }
    };
    this.updateTable = function(data){
        var el = document.getElementById("inboxMailRows");
        var html = "";
        for (var y=0; y<data.length; y++){
            var row = data[ y ];
            html += '<tr><td><input type="checkbox"></td><td>'+ row.date +'</td><td>'+ row.subject +'</td><td>'+ row.from +'</td></tr>';
        }
        el.innerHTML = html;
    };
    this.updateBadge = function(stateName, value){
        var badge = document.getElementById(stateName + "Badge");
        if (badge){
            badge.innerText = value;
        }
    };
    this.updateFolder = function(stateName, isSelected){
        var folder = document.getElementById(stateName + "ListItem");
        if (folder){
            folder.className = isSelected ? "active" : " ";
        }
    };
    this.updatePreview = function(data){
        var preview = document.getElementById( "inboxPreview" );
        if (preview){
            preview.innerText = data.body ? data.body : "";
        }
    };
}


module.exports = MailView;