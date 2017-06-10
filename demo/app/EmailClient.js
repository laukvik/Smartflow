function EmailClient() {
    this.viewEnabled = function (view) {
        this.setVisible(view, true);
    };
    this.viewDisabled = function (view) {
        this.setVisible(view, false);
    };
    this.stateChanged = function (state) {
        //console.info("Email.stateChanged: ", state);
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
        //console.info("Email.dialogEnabled: ", name, features);
    };
    this.dialogDisabled = function(name, answer) {
        //console.info("Email.dialogDisabled: ", name, answer);
    };
    this.dialogChanged = function(features) {
        //console.info("Email.dialogChanged: ", features);
    };
    this.setVisible = function(viewName, isVisible) {
        document.getElementById(viewName).style.display = isVisible ? "block" : "none";
    };
}
module.exports = EmailClient;