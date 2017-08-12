# Smartflow

The Smartflow API enables you to create JavaScript applications with predictable states. All
state changes is done by using actions that tells Smartflow. Actions can navigate to other
controllers. If several actions are called serially, the will be queued and executed in their
proper order.

routing/ path
language
config
states
declarative actions controls flow

Controller -> 
  action -> change state  -> New controller
    



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
app.addView(new InboxView());
app.addView(new ComposeView());
app.start();
```

## Controller

The purpose of the controller is to manage a dedicated part of the application. A view
is typically based of one or more user interface components. Each controller is mapped
to a specific path using HTML anchors. If the HTML document is called index.html the 
browser will show "index.html#/inbox".

Example: The controller is mapped to the path "/inbox" in the browser.

```javascript
function InboxView(){
  this.smartflow = {
    "path" : "/inbox"
  };
}
```

### Events

The controllers receives events when the application changes state.

| Event              | Description                                   |
|:------------------ |:----------------------------------------------| 
| viewInitialized    | The view is initialized                       |       
| viewEnabled        | The view lost focus                           |       
| viewDisabled       | The view gained focus                         |       
| actionPerformed    | The specified action was performed            |       
| stateChanged       | The state change to the value                 |       

### Example: events

```javascript
function ComposeView(){
  this.smartflow = {
    "path" : "/compose"
  };
  this.viewInitialized = function(formatter){
  };
  this.viewEnabled = function(){
  };
  this.viewDisabled = function(){
  };
  this.actionPerformed = function(evt){
      {
          "action": ""
      }
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
