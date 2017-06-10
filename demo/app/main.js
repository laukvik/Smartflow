var Smartflow = require('../../smartflow');
var EmailClient = require('./EmailClient');
var AddressbookView = require('./AddressbookView.jsx');
var ComposeView = require('./ComposeView');
var ConfirmDialog = require('./ConfirmDialog');
var LoginView = require('./LoginView');
var LogoutView = require('./LogoutView');
var MailView = require('./MailView');
var Notification = require('./Notification');
var ProgressDialog = require('./ProgressDialog');
var SendMailAction = require('./SendMailAction');


var app = new Smartflow();
app.setMain(new EmailClient(), "EmailClient");
app.setDevelopmentMode(true);
app.loadLanguage("no", {"welcome": "Velkommen {0} {1}.", "answer": "Svar"});
app.loadLanguage("en", {"welcome": "Welcome {0} {1}.", "question": "Question"});
app.setLanguage("en");

app.addView(new LoginView(), "LoginView", "/", []);
app.addView(new LogoutView(), "LogoutView", "/logout", []);
app.addView(new AddressbookView(), "AddressbookView", "/addressbook", ["addressbook"] );
app.addView(new MailView(), "InboxView", "/mails", ["mails", "mail-index", "mail-selection", "preview", "inbox", "draft", "sent", "archive", "trash", "folder"]);
app.addView(new ComposeView(), "ComposeView", "/compose", ["compose"]);

app.registerArray( "inbox",   [], "A list of emails in the inbox folder", false );
app.registerArray( "draft",   [], "A list of emails in the draft folder", false );
app.registerArray( "sent",    [], "A list of emails in the sent folder", false );
app.registerArray( "archive", [], "A list of emails in the archive folder", false );
app.registerArray( "trash",   [], "A list of emails in the trash folder", false );
app.registerArray( "addressbook", [], "A list of contacts for the addressbook", false );
app.registerJson( "preview", {}, "The selected email", false );
app.registerString( "folder", "inbox", "The name of the selected folder", true );
app.registerString( "mail-index", 0, "The index of the selected mail", true );
app.registerString( "mail-selection", 0, "The name of the selected folder", true );


app.addDialog(new ConfirmDialog(), "ConfirmDelete", "A confirmation dialog");
app.addDialog(new ProgressDialog(), "ProgressDialog");

app.addTutorial("MailTutorial", "A tutorial for explaining the mail view.", ["InboxView"]);

app.addAction(new SendMailAction(), "Sends emails from the MailView");

app.startApplication();


var dataInbox = [
    { "date": "2017-01-01", "subject": "I thought it would be easier", "from": "Donald Trump", "body" : "'I loved my previous life. I had so many things going,' Trump told Reuters in an interview. 'This is more work than in my previous life. I thought it would be easier.'" },
    { "date": "2009-01-01", "subject": "I miss being anonymous", "from": "barack@obama.com", "body" : "'I just miss -- I miss being anonymous,' he said at the meeting in the White House State Dining Room. 'I miss Saturday morning, rolling out of bed, not shaving, getting into my car with my girls, driving to the supermarket, squeezing the fruit, getting my car washed, taking walks. I can't take a walk.'He says he enjoys golf but is not the fanatic that some have portrayed him to be because of the frequency of his golf outings." },
    { "date": "2001-01-01", "subject": "Bring them on", "from": "george@bush.com", "body" : "'There are some who feel like that, uh, if they attack us, that we may decide to leave prematurely. They don’t understand what they’re talkin’ about if that’s the case. . . Let me finish. Um, there are some who feel like, that, you know, the conditions are such that they can attack us there. My answer is bring ‘em on! We got the force necessary to deal with the security situation.'" }
];

var dataAddressbook = [
    { "first": "Donald", "last": "Trump", "company": "President", "email" : "donald@trump.gov" },
    { "first": "Barack", "last": "Obama", "company": "President", "email" : "barack@obama.gov" },
    { "first": "George", "last": "W. Bush Jr", "company": "President", "email" : "george@bush.gov" }
];

app.setState("inbox", dataInbox);
app.setState("addressbook", dataAddressbook);

document.getElementById("docs").innerHTML = app.displayDocumentation();
