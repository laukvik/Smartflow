import {Smartflow} from "../../src/Smartflow";
import {MainView} from "./views/MainView";
import {InboxView} from "./views/InboxView";

let config = {
  "LoginAction": "/api/login",
  "DeleteAction": "/api/delete"
};

let langNO = {
  "welcome": "Velkommen til {0}",
  "confirmdelete": "Er du sikker på at du vil slette?",
  "deleted": "Slettet."
};
let langEN = {
  "welcome": "Welcome til {0}",
  "confirmdelete": "Are you sure you want to delete?",
  "deleted": "Deleted."
};


let app = new Smartflow();
app.setConfig(config);
app.loadLanguage("no", langNO);
app.loadLanguage("en", langEN);
app.setDefaultLocale("en");
app.addView(new MainView());
app.addView(new InboxView());
app.start();
