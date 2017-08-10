# Smartflow

The Smartflow API enables you to create JavaScript applications with predictable states. All
state changes is done by using actions that tells Smartflow. Actions can navigate to other
controllers. If several actions are called serially, the will be queued and executed in their
proper order.

## Installation

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install smartflow --save
```

## Application

The application 

Example:

```javascript
var app = new Smartflow();
app.addController(new InboxController());
app.addController(new ComposeController());
app.start();
```

## Controller

The purpose of the controller is to manage a view in the application. A view
is typically based of one or more user interface components. Each controller is mounted
to a specific path.

```javascript
function InboxController(){
  this.smartflow = {
    "path" : "/inbox"
  };
}
```

### Events

The controllers receives events when the application changes state.

| Event              | Description                                   |
|:------------------ |:----------------------------------------------| 
| viewInitialized    | The controller is being initialized           |       
| viewEnabled        | The controller has lost focus                 |       
| viewDisabled       | The controller has gained focus               |       
| actionPerformed    | The specified action was performed            |       
| stateChanged       | The named state was change                    |       

### Example: events

```javascript
function ComposeController(){
  this.smartflow = {
    "path" : "/compose"
  };
  this.viewInitialized = function(){
  };
  this.viewEnabled = function(){
  };
  this.viewDisabled = function(){
  };
  this.actionPerformed = function(action){
  }
  this.stateChanged = function(state, value){
  }
}
```


## Action



### Action with a web request 

Example: Execute a "get" request to "/api/time" and put the result in the state called "time" and
navigate to the controller mapped to "/time". 

```javascript
function FetchTimeAction() {
  this.smartflow = {
    "state": "time",
    "path": "/time",
    "request": {
      "url": "/api/time",
      "method": "get"
    },
    "error": "/login"
  }
}
```

### Action without a web request

Example: Set the "action" state to "delete" and "id" state to 12 and then navigate to the controller 
that is mapped to the path "/inbox".

```javascript
function DeleteAction() {
  this.smartflow = {
    "path" : "/inbox",
    "states": {
      "action" : "delete",
      "id": 12
    }
  }
}
```
