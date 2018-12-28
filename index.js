require("dotenv").config();
var https = require("https");
var http = require("http");
const scraper = require("./src/Scraper");
var exec = require("child_process").exec;

// Max sockets set to 3 to limit error when hitting wikipedia.
http.globalAgent.maxSockets = 3;
https.globalAgent.maxSockets = 3;

const { DB_host, DB_pass, DB_user } = process.env;
const command = `mycli --local-infile=1 --no-warn -p${DB_pass}  mysql://${DB_user}@${DB_host}:3306/${DB_user} < update_db.sql`;

function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    callback(stdout);
  });
}

scraper()
  .then(() => {
    console.log("Finished scraping.\nWriting to database.");
    execute(command, stdout => {
      console.log(stdout);
    });
  })
  .catch(err => {
    console.log(err);
  });
