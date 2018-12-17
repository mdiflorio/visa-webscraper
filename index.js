var https = require("https");
var http = require("http");

// Max sockets set to 3 to limit error when hitting wikipedia.
http.globalAgent.maxSockets = 3;
https.globalAgent.maxSockets = 3;
const scraper = require("./src/Scraper");

scraper();
