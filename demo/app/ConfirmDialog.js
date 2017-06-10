function ConfirmDialog() {
    this._id = "ConfirmDialog";
    this.dialogInitialized = function (app) {
        document.getElementById(this._id + "-Yes").addEventListener("click", function(){
            app.closeDialog("yes");
        });
        document.getElementById(this._id + "-No").addEventListener("click", function(){
            app.closeDialog("no");
        });
        document.getElementById(this._id + "-Close").addEventListener("click", function(){
            app.closeDialog();
        });
    };
    this.setFeature = function(name, value){
        if (value != undefined){
            var el = document.getElementById(this._id + "-" + name);
            if (el != undefined){
                el.innerText = value;
            }
        }
    };
    this.dialogChanged = function (features) {
        console.info("ConfirmDialog.dialogChanged: ", features, this._id);
        if (features != undefined){
            this.setFeature("Label", features.label);
            this.setFeature("Description", features.description);
        }
    };
    this.dialogEnabled = function (features) {
        //console.info("ConfirmDialog.dialogEnabled: ", features);
        this.dialogChanged(features);
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


module.exports = ConfirmDialog;