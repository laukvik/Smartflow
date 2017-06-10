function LogoutView() {
    this.viewInitialized = function (app) {
        document.getElementById("logoutGotoSignIn").addEventListener("click", function(){
            app.setPath("/");
        });
    }
}

module.exports = LogoutView;