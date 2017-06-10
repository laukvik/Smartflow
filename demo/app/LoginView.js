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

module.exports = LoginView;