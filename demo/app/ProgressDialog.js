function ProgressDialog() {
    this._id = "ProgressDialog";
    this.dialogInitialized = function (app) {
    };
    this.dialogEnabled = function (features) {
        this.dialogChanged(features);
        this.setDialogVisible(true);
    };
    this.dialogDisabled = function(answer) {
        this.setDialogVisible(false);
    };
    this.dialogChanged = function(features) {
        document.getElementById(this._id + "Text").innerText = features.label;
        document.getElementById(this._id + "Value").style.width = features.value + "%";
    };
    this.setDialogVisible = function(isVisible){
        document.getElementById(this._id).style.display = isVisible ? "block" : "none";
        document.getElementById(this._id).className = isVisible ? "modal fade in" : "modal fade out";
    }
}

module.exports = ProgressDialog;