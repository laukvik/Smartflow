function SendMailAction( to, subject, message ){
    this.to = to;
    this.subject = subject;
    this.message = message;
    this.dialogInitialized = function (app) {
        this._app = app;
    };
    this.runAction = function(app){
        //var arr = app.getState("messages") || [];
        //arr.push({to: this.to, subject: this.subject, message: this.message, date: new Date()});

        // Progressbar while connecting to server
        // Show error message when failed
        // Show ok message if not
        app.openDialog("ProgressDialog", {"label": "1/2 Sending email...", "value": 30});

        setTimeout(function(){
            app.updateDialog({"label": "2/2 Updating email...", "value": 60});
        }, 1000);

        setTimeout(function(){
            app.updateDialog({"label": "2/2 Updating email...", "value": 80});
        }, 2000);

        setTimeout(function(){
            app.updateDialog({"label": "Successfully sent", "value": 100});
        }, 3000);
        setTimeout(function(){
            app.closeDialog();
        }, 3500);
    };
}

module.exports = SendMailAction;