import {Application} from "../../src/Application";
import {NavigationView} from "./views/NavigationView";
import {NotFoundView} from "./views/NotFoundView";
import {SearchView} from "./views/SearchView";
import {CatalogView} from "./views/CatalogView";
import {EditView} from "./views/EditView";
import {DetailsView} from "./views/DetailsView";
import {InputExamplesView} from "./views/InputExamplesView";
import {PresentationExamplesView} from "./views/PresentationExamplesView";
import {TableExamplesView} from "./views/TableExamplesView";
import {ItemsExamplesView} from "./views/ItemsExamplesView";
import {ProgressExamplesView} from "./views/ProgressExamplesView";
import {DialogExamplesView} from "./views/DialogExamplesView";
import {ButtonExamplesView} from "./views/ButtonExamplesView";

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


let app = new Application();
app.setConfig(config);
app.loadLanguage("no", langNO);
app.loadLanguage("en", langEN);
app.setDefaultLocale("en");
app.addView(new InputExamplesView());
app.addView(new PresentationExamplesView());
app.addView(new TableExamplesView());
app.addView(new ItemsExamplesView());
app.addView(new ProgressExamplesView());
app.addView(new DialogExamplesView());
app.addView(new ButtonExamplesView());
app.addView(new CatalogView());
app.addView(new DetailsView());
app.addView(new EditView());
// app.addView(new NotFoundView());
app.addView(new NavigationView());
app.start();
