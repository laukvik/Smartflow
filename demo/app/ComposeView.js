function ComposeView() {
    this.viewInitialized = function (app) {
        var self = this;
        document.getElementById("ComposeView-CancelButton").addEventListener("click", function(){
            app.setPath("/mails/inbox");
        });

        document.getElementById("ComposeView-SendButton").addEventListener("click", function(){

            var to = document.getElementById("ComposeView-To").value;
            var subject = document.getElementById("ComposeView-Subject").value;
            var msg = document.getElementById("ComposeView-Message").value;

            var action = new SendMailAction( to, subject, msg );
            app.startAction(action, self);
        });
    }
    this.actionSuccess = function(results){
        console.info("ComposeView.actionSuccess: ", results);
        app.setPath("/mails/inbox");
    };
    this.actionFailed = function(results){
        console.info("ComposeView.actionFailed: ", results);
    };
}

module.exports = ComposeView;