function LoginView() {
    this.viewInitialized = function (app) {
        console.info("LoginView.viewInitialized");
    };
    this.viewEnabled = function (app) {
        console.info("LoginView.viewEnabled");
    };
    this.viewDisabled = function (app) {
        console.info("LoginView.viewDisabled");
    };
}

function LogoutView() {
    this.viewInitialized = function (app) {
        console.info("LogoutView.viewInitialized");
    }
}

function InboxView() {
    this.viewInitialized = function (app) {
        console.info("InboxView.viewInitialized");
        this.update(app.getState("inbox"));
    };
    this.stateChanged = function (app) {
        console.info("InboxView.stateChanged: ", app.getPath());
        this.update(app.getState("inbox"));
    };
    this.update = function(data){
        var el = document.getElementById("inboxRows");
        var html = "";
        for (var y=0; y<data.length; y++){
            var row = data[ y ];
            html += '<tr><td><input type="checkbox"></td><td>'+ row.date +'</td><td>'+ row.subject +'</td><td>'+ row.from +'</td></tr>';
        }
        el.innerHTML = html;
    };
}

function ComposeView() {
    this.viewInitialized = function (app) {
        console.info("ComposeView.viewInitialized");
    }
}

function AddressbookView() {
    this.viewInitialized = function (app) {
        console.info("AddressbookView.viewInitialized: ");
        this.update(app.getState("addressbook"));
    };
    this.viewEnabled = function (app) {
        console.info("AddressbookView.viewEnabled: ", app.getPath());
    };
    this.viewDisabled = function (app) {
        console.info("AddressbookView.viewDisabled: ", app.getPath());
    };
    this.pathChanged = function (app) {
        console.info("AddressbookView.pathChanged: ", app.getPath());
    };
    this.stateChanged = function (app) {
        console.info("AddressbookView.stateChanged: ", app.getPath());
        this.update(app.getState("addressbook"));
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

var dataInbox = [
    { "date": "2017-01-01", "subject": "Didn't thought it should be this hard", "from": "Donald Trump" },
    { "date": "2009-01-01", "subject": "I miss being anonymous", "from": "barack@obama.com" },
    { "date": "2001-01-01", "subject": "My answer is bring them on.", "from": "george@bush.com" }
];

var dataAddressbook = [
    { "first": "Donald", "last": "Trump", "company": "President" },
    { "first": "Barack", "last": "Obama", "company": "President" },
    { "first": "George", "last": "W. Bush Jr", "company": "President" }
];



var app = new Smartflow();
app.setDevelopmentMode(true);
app.loadLanguage("no", {"welcome": "Velkommen {0} {1}."});
app.loadLanguage("en", {"welcome": "Welcome {0} {1}."});
app.setLanguage("en");
app.setState( "inbox", dataInbox );
app.setState( "addressbook", dataAddressbook );

app.addView(new LoginView(), "LoginView", "/");
app.addView(new LogoutView(), "LogoutView", "/logout");
app.addView(new AddressbookView(), "AddressbookView", "/addressbook");
app.addView(new InboxView(), "InboxView", "/inbox");
app.addView(new ComposeView(), "ComposeView", "/compose");
app.startApplication();

