const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const TYPE_UNKNOWN = 'application/unknown';
const TYPE_JSON = 'application/json';
const TYPE_HTML = 'text/html';
const TYPE_XML = 'application/xml';
const TYPE_PLAIN = 'text/plain';
const TYPE_CSS = 'text/css';
const TYPE_JS = 'text/js';









const server = http.createServer((req, res) => {
  const path = req.url;
  //console.log(path);

  // ------------------ System -----------------------------
  if (path  == '/') {
    html(res, '<html><body><h1>API</h1><ul>' +

      link("/api/login") +
      link("/api/addressbook") +
      link("/api/inbox") +
      link("/api/time") +
      link("/api/quote") +

      link("/api/get") +
      link("/api/put") +
      link("/api/post") +
      link("/api/delete") +
      link("/api/patch") +

      link("/api/xml") +
      link("/api/text") +
      link("/api/json") +

      link("/api/json/invalid") +
      link("/api/xml/invalid") +

      link("/api/404") +
      link("/api/300") +
      link("/api/500") +
      link("/api/100") +

      '</ul></body></html>');

  } else if (path === '/index.html') {
    fs.readFile('./public/index.html', (err, data) => {
      html(res, data);
    });

  } else if (path === '/smartflow.js') {
    fs.readFile('./src/smartflow.js', (err, data) => {
      html(res, data);
    });

  } else if (path.startsWith('/node_modules')) {
    const contentType= findMimeType(path);

    fs.readFile('./' + path, (err, data) => {
      out(res, contentType, data);
    });

  } else if (path === '/favicon.ico') {
    res.statusCode = 403;
    res.end;

    // ------------------ SAMPLES -----------------------------


  } else if (path === '/api/inbox') {

    const data = [
      { "date": "2017-01-01", "subject": "I thought it would be easier", "from": "Donald Trump", "body" : "'I loved my previous life. I had so many things going,' Trump told Reuters in an interview. 'This is more work than in my previous life. I thought it would be easier.'" },
      { "date": "2009-01-01", "subject": "I miss being anonymous", "from": "barack@obama.com", "body" : "'I just miss -- I miss being anonymous,' he said at the meeting in the White House State Dining Room. 'I miss Saturday morning, rolling out of bed, not shaving, getting into my car with my girls, driving to the supermarket, squeezing the fruit, getting my car washed, taking walks. I can't take a walk.'He says he enjoys golf but is not the fanatic that some have portrayed him to be because of the frequency of his golf outings." },
      { "date": "2001-01-01", "subject": "Bring them on", "from": "george@bush.com", "body" : "'There are some who feel like that, uh, if they attack us, that we may decide to leave prematurely. They don’t understand what they’re talkin’ about if that’s the case. . . Let me finish. Um, there are some who feel like, that, you know, the conditions are such that they can attack us there. My answer is bring ‘em on! We got the force necessary to deal with the security situation.'" }
    ];

    json(res, data);

  } else if (path === '/api/categories') {

    const data = '<categories><category>amazon</category><category>android</category> <category>blu</category> <category>gear</category> <category>mobile</category> <category>security</category></categories>';
    xml(res, data);

  } else if (path === '/api/addressbook') {

    const data = [
      { "first": "Donald", "last": "Trump", "company": "President", "email" : "donald@trump.gov" },
      { "first": "Barack", "last": "Obama", "company": "President", "email" : "barack@obama.gov" },
      { "first": "George", "last": "W. Bush Jr", "company": "President", "email" : "george@bush.gov" }
    ];

    json(res, data);

  } else if (path === '/api/time') {
    const now = new Date();

    json(res, {
      "year": now.getFullYear(),
      "month": now.getMonth(),
      "day": now.getDay(),
      "hour": now.getHours(),
      "min": now.getMinutes(),
      "sec": now.getSeconds(),
    });

  } else if (path === '/api/login') {
    text(res, "usr=" + "");

  } else if (path === '/api/quote') {
    text(res, "I love you the more in that I believe you had liked me for my own sake and for nothing else.");

    // ------------------ HTTP METHODS -----------------------------
  } else if (path === '/api/get') {
    text(res, "Ok");
  } else if (path === '/api/post') {
    text(res, "Ok");
  } else if (path === '/api/put') {
    text(res, "Ok");
  } else if (path === '/api/patch') {
    text(res, "Ok");
  } else if (path === '/api/delete') {
    text(res, "Ok");

    // ------------------ TYPES -----------------------------
  } else if (path === '/api/json') {

    const data = [
      { "first": "Donald" },
      { "first": "Barack" },
      { "first": "George" }
    ];
    json(res, data);

  } else if (path === '/api/xml') {

    const data = '<xml>Lorem ipsum dolor sit amet</xml>';
    xml(res, data);

  } else if (path === '/api/text') {
    text(res, "Lorem ipsum dolor sit amet");

    // ------------------ TYPES: INVALID -------------------------
  } else if (path === '/api/json/invalid') {
    res.statusCode = 200;
    res.setHeader('Content-Type', TYPE_JSON);
    res.end('[ {"first": "Donald"} ');

  } else if (path === '/api/xml/invalid') {

    xml( res, '<xml>Lorem ipsum dolor sit amet' );

    // ------------------ HTTP CODES -----------------------------
  } else if (path === '/api/404') {
    notFound(res, "Not found");

  } else if (path === '/api/500') {
    res.statusCode = 500;
    res.setHeader('Content-Type', TYPE_PLAIN);
    res.end("Internal server error");

  } else if (path === '/api/300') {
    res.statusCode = 301;
    res.setHeader('Content-Type', TYPE_PLAIN);
    res.end("Moved Permanently");

  } else if (path === '/api/100') {
    res.statusCode = 100;
    res.setHeader('Content-Type', TYPE_PLAIN);
    res.end("Continue");

  } else {
    notFound(res, "Not found");
  }


});

function findMimeType(path){
  if (path.endsWith(".css")) {
    return TYPE_CSS;
  } else if (path.endsWith(".js")){
    return TYPE_JS;
  } else if (path.endsWith(".html")){
    return TYPE_HTML;
  } else if (path.endsWith(".xml")){
    return TYPE_XML;
  } else {
    return TYPE_UNKNOWN;
  }
}

function notFound(res, data){
  out(res, TYPE_PLAIN, data );
}

function json(res, data){
  out(res, TYPE_JSON, JSON.stringify( data ));
}

function html(res, data){
  out(res, TYPE_HTML, data);
}

function xml(res, data){
  out(res, TYPE_XML, data);
}

function text(res, data){
  out(res, TYPE_PLAIN, data);
}

function css(res, data){
  out(res, TYPE_CSS, data);
}

function js(res, data){
  out(res, TYPE_JS, data);
}

function out(res, mimeType, data){
  res.statusCode = 200;
  res.setHeader('Content-Type', mimeType);
  res.end( data );
}

function link(url){
  return '<li><a href="' + url + '">' + url + '</a></li>';
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
