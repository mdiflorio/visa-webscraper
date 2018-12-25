var https = require("https");
var http = require("http");
const scraper = require("./src/Scraper");

// Max sockets set to 3 to limit error when hitting wikipedia.
http.globalAgent.maxSockets = 3;
https.globalAgent.maxSockets = 3;

scraper();
