function LoginController(){
    this.viewInitialized = function(){
        console.info("LoginController.viewInitialized()");
    };
    this.stateChanged = function(application){
        console.info("LoginController.stateChanged: ", application);
    };

    this.viewEnabled = function(application) {
        //this.update(application.getState("messages"));
        console.info("LoginController.viewEnabled()");
        application.setState("login.user", "donald@trump.com");
        application.setState("login.button", {
                "disabled": "true",
                "title": "Klikk for å logge deg på",
                "value":    "Logg inn"
        });
    };

    this.viewDisabled = function(application) {
    };
}

function LogoutController(){
    this.viewInitialized = function(){
        console.info("LogoutController.viewInitialized()");
    };
}

function InboxController(){
    this.viewInitialized = function(){
        console.info("InboxController.viewInitialized()");
    };
}

function AddressbookController(){
    this.viewInitialized = function(){
        console.info("AddressbookController.viewInitialized()");
    };
}


var app = new Smartflow();
app.addView(new LoginController());
app.addView(new LogoutController());
app.addView(new InboxController());
app.addView(new AddressbookController());
