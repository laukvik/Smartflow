function EmailClient() {
    this.viewEnabled = function (view) {
        this.setVisible(view, true);
    };
    this.viewDisabled = function (view) {
        this.setVisible(view, false);
    };
    this.stateChanged = function (state) {
        console.info("Email.stateChanged: ", state);
    };
    this.loginChanged = function (login) {
        //console.info("Email.loginChanged: ", login);
    };
    this.pathChanged = function (path) {
        //console.info("Email.pathChanged: ", path);
    };
    this.startApplication = function(){
    };
    this.dialogEnabled = function(name, features) {
        console.info("Email.dialogEnabled: ", name, features);
    };
    this.dialogDisabled = function(answer) {
        console.info("Email.dialogDisabled: ", answer);
    };
    this.setVisible = function(viewName, isVisible) {
        document.getElementById(viewName).style.display = isVisible ? "block" : "none";
    };
}

function LoginView() {
    this.viewInitialized = function (app) {
        this._app = app;
        var self = this;
        document.getElementById("loginSignIn").addEventListener("click", function(){
            self.checkLogin();
        });
    };
    this.checkLogin = function(){
        var username = document.getElementById("loginUser").value;
        var password = document.getElementById("loginPassword").value;
        this._app.setPath("/mails");
    };
}

function LogoutView() {
    this.viewInitialized = function (app) {
        var self = app;
        document.getElementById("logoutGotoSignIn").addEventListener("click", function(){
            app.setPath("/");
        });
    }
}

function MailView() {
    this.folders = ["inbox", "draft", "sent", "archive", "trash"];
    this.viewInitialized = function (app) {
        this._app = app;
        var self = this._app;
        document.getElementById("mailboxLogoutButton").addEventListener("click", function(){
            app.setPath("/logout");
        });
        document.getElementById("mailboxComposeButton").addEventListener("click", function(){
            app.setPath("/compose");
        });
        document.getElementById("mailboxDeleteButton").addEventListener("click", function(){
            app.openDialog("ConfirmDelete");
        });
    };
    this.pathChanged = function (path) {
        console.info("MailView.stateChanged: ", path);
        this._app.setState( "folder-selected", path );
    };
    this.stateChanged = function (state) {
        console.info("MailView.stateChanged: ", state);
        if (state.name == "inbox") {
            this.updateTable(state.value);

        } else if (state.name == "preview") {
            this.updatePreview(state.value);

        } else if (state.name == "folder-selected") {

            console.info("folder: ", state.value );

            for (var x=0; x<this.folders.length; x++){
                var folder = this.folders[ x ];
                this.updateSelectedFolder( folder, state.value == folder);
            }

        } else if (state.name == "mail-selection") {

            var el = document.getElementById("inboxMailRows");
            var rows = el.getElementsByTagName("INPUT");
            var arr = state.value;
            for (var x=0; x<arr.length; x++){
                var rowIndex = arr[x];
                rows[ rowIndex ].checked = true;
            }

        } else if (state.name == "mail-index") {

            var el = document.getElementById("inboxMailRows");
            var rows = el.getElementsByTagName("TR");
            //rows[ state.value ].style.backgroundColor = "#dddddd";

        } else {
            this.updateBadge(state.name, state.value);
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
    this.updateBadge = function(stateName, data){
        var badge = document.getElementById(stateName + "Badge");
        if (badge){
            badge.innerText = data.length == 0 ? "" : data.length;
        }
    };
    this.updateSelectedFolder = function(stateName, isSelected){
        var folder = document.getElementById(stateName + "ListItem");
        if (folder){
            folder.className = isSelected ? "list-group-item active": "list-group-item";
        }
    };
    this.updatePreview = function(data){
        var preview = document.getElementById( "inboxPreview" );
        if (preview){
            preview.innerText = data.body ? data.body : "";
        }
    };
}

function ComposeView() {
    this.viewInitialized = function (app) {
        document.getElementById("ComposeView-CancelButton").addEventListener("click", function(){
            app.setPath("/mails/inbox");
        });

        document.getElementById("ComposeView-SendButton").addEventListener("click", function(){

            // ComposeView-To
            // ComposeView-Subject
            // ComposeView-Message
            var to = document.getElementById("ComposeView-To").value;
            var subject = document.getElementById("ComposeView-Subject").value;
            var msg = document.getElementById("ComposeView-Message").value;

            app.setState("sendmail", {"to": to, "subject": subject, "message": msg});

            app.setPath("/mails/inbox");
        });
    }
}

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

function InboxTutorial() {
    this.viewInitialized = function (app) {
    };
    this.stateChanged = function (state) {
        console.info("InboxTutorial.stateChanged: ", state);
    };
}

function ConfirmDialog() {
    this._id = "ConfirmDialog";
    this.dialogInitialized = function (app) {
        console.info("ConfirmDialog.viewInitialized: ");
        document.getElementById(this._id + "Yes").addEventListener("click", function(){
            app.closeDialog("yes");
        });
        document.getElementById(this._id + "No").addEventListener("click", function(){
            app.closeDialog("no");
        });
        document.getElementById(this._id + "Close").addEventListener("click", function(){
            app.closeDialog();
        });
    };
    this.stateChanged = function (state) {
        console.info("ConfirmDialog.stateChanged: ", state);
    };
    this.dialogEnabled = function (features) {
        console.info("ConfirmDialog.dialogEnabled: ", features);
        //document.getElementById(this._id).querySelector(".modal-body").innerText = "Hei";
        this.setDialogVisible(true);
    };
    this.dialogDisabled = function(answer) {
        console.info("ConfirmDialog.dialogDisabled: ", answer);
        this.setDialogVisible(false);
    };
    this.setDialogVisible = function(isVisible){
        document.getElementById(this._id).style.display = isVisible ? "block" : "none";
        document.getElementById(this._id).className = isVisible ? "modal fade in" : "modal fade out";
    }
}

function SendMailAction(){

}


var app = new Smartflow(new EmailClient(), "EmailClient");
app.setDevelopmentMode(true);
app.loadLanguage("no", {"welcome": "Velkommen {0} {1}."});
app.loadLanguage("en", {"welcome": "Welcome {0} {1}."});
app.setLanguage("en");

app.addView(new LoginView(), "LoginView", "/", []);
app.addView(new LogoutView(), "LogoutView", "/logout", []);
app.addView(new AddressbookView(), "AddressbookView", "/addressbook", ["addressbook"] );
app.addView(new MailView(), "InboxView", "/mails", ["mails", "mail-index", "mail-selection", "preview", "inbox", "draft", "sent", "archive", "trash", "folder-selected"]);
app.addView(new ComposeView(), "ComposeView", "/compose", ["compose"]);
app.addView(new InboxTutorial(), "InboxTutorial", "", [] );

app.addDialog(new ConfirmDialog(), "ConfirmDelete");

app.registerArray( "inbox",   [], "A list of emails in the inbox folder", false );
app.registerArray( "draft",   [], "A list of emails in the draft folder", false );
app.registerArray( "sent",    [], "A list of emails in the sent folder", false );
app.registerArray( "archive", [], "A list of emails in the archive folder", false );
app.registerArray( "trash",   [], "A list of emails in the trash folder", false );
app.registerArray( "addressbook", [], "A list of contacts for the addressbook", false );
app.registerJson( "preview", {}, "The selected email", false );
app.registerString( "folder-selected", "inbox", "The index of the selected folder", true );
app.registerString( "mail-index", 0, "The index of the selected mail", true );
app.registerString( "mail-selection", 0, "The name of the selected folder", true );

app.displayDocumentation();

app.startApplication();

var dataInbox = [
    { "date": "2017-01-01", "subject": "I thought it would be easier", "from": "Donald Trump", "body" : "'I loved my previous life. I had so many things going,' Trump told Reuters in an interview. 'This is more work than in my previous life. I thought it would be easier.'" },
    { "date": "2009-01-01", "subject": "I miss being anonymous", "from": "barack@obama.com", "body" : "'I just miss -- I miss being anonymous,' he said at the meeting in the White House State Dining Room. 'I miss Saturday morning, rolling out of bed, not shaving, getting into my car with my girls, driving to the supermarket, squeezing the fruit, getting my car washed, taking walks. I can't take a walk.'He says he enjoys golf but is not the fanatic that some have portrayed him to be because of the frequency of his golf outings." },
    { "date": "2001-01-01", "subject": "Bring them on", "from": "george@bush.com", "body" : "'There are some who feel like that, uh, if they attack us, that we may decide to leave prematurely. They don’t understand what they’re talkin’ about if that’s the case. . . Let me finish. Um, there are some who feel like, that, you know, the conditions are such that they can attack us there. My answer is bring ‘em on! We got the force necessary to deal with the security situation.'" }
];

var dataAddressbook = [
    { "first": "Donald", "last": "Trump", "company": "President", "email" : "donald@trump.gov" },
    { "first": "Barack", "last": "Obama", "company": "President", "email" : "barack@obama.gov" },
    { "first": "George", "last": "W. Bush Jr", "company": "President", "email" : "george@bush.gov" }
];

app.setState("inbox", dataInbox);
app.setState("addressbook", dataAddressbook);
