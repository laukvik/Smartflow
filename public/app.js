

var reqLogin = new SmartflowRequest('/api/login');
var reqCategories = new SmartflowRequest('/api/categories');
var reqAddressbook = new SmartflowRequest('/api/addressbook');
var reqQuote = new SmartflowRequest('/api/quote');


var actionWithRequests = new SmartflowAction();
actionWithRequests.addRequest( reqLogin );
actionWithRequests.addRequest( reqCategories );
actionWithRequests.addRequest( reqAddressbook );
actionWithRequests.addRequest( reqQuote );


function HelloWorldAction() {
  this.runAction = function() {
    console.info('HelloWorldAction: ');
  };
}

var actionSimple = new HelloWorldAction();

var app = new SmartflowApplication();
app.startAction( actionWithRequests );
app.startAction( actionSimple );
