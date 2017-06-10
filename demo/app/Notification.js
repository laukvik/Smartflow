function Notification(){
    this._id = "Notification";
    this.notificationInitialized = function(){

    };
    this.notificationClose = function(){
        this.setVisible(false);
    };
    this.notificationOpen = function(features) {
        document.getElementById(this._id + "Label").innerText = features.label;
        document.getElementById(this._id + "Description").innerText = features.description;
        this.setVisible(true);
    };
    this.setVisible = function(isVisible){
        document.getElementById(this._id).style.display = isVisible ? "block" : "none";
        //document.getElementById(this._id).className = isVisible ? "modal fade in" : "modal fade out";
    }
}

module.exports = Notification;