const fs = require("fs");
const rp = require("request-promise");
const $ = require("cheerio");

var http = require("http");
var https = require("https");
http.globalAgent.maxSockets = 3;
https.globalAgent.maxSockets = 3;

async function scraper() {
  const BASE_URL = "https://en.wikipedia.org";
  const url = `${BASE_URL}/wiki/Category:Visa_requirements_by_nationality`;
  let data = {};

  let arrayOfPromises = [];

  console.log("Scraping away...");

  // Get html from url
  await rp(url)
    .then(async html => {
      // Get list of links of different nationality requirement wiki pages.
      const nationalityRequirements = $(
        ".mw-category-group > ul > li > a",
        html
      );

      // Go through list of nationality links
      await nationalityRequirements.map(async i => {
        // Parse nationality name
        let nationalityName = nationalityRequirements[i].attribs.title;
        nationalityName = nationalityName
          .split("Visa requirements for")
          .pop()
          .split("citizens")
          .shift()
          .trim();

        // Get html from each nationality page
        let options = {
          uri: `${BASE_URL}${nationalityRequirements[i].attribs.href}`
        };

        let promise = new Promise((resolve, reject) => {
          rp(options)
            .then(nationalityHtml => {
              let countries = "";
              // Get each field in the table rows
              $(".sortable > tbody > tr > td > a", nationalityHtml).each(
                function(i) {
                  let name = $(this)
                    .text()
                    .trim();
                  let visa = $(this)
                    .parent()
                    .next()
                    .text()
                    .replace(/\[.*\]/g, "")
                    .trim();
                  let duration = $(this)
                    .parent()
                    .next()
                    .next()
                    .text()
                    .trim();
                  let note = $(this)
                    .parent()
                    .next()
                    .next()
                    .next()
                    .text()
                    .replace(/\[.*\]/g, "")
                    .trim();
                  let country = `${nationalityName},${name},${visa},${duration},${note}\n`;

                  // Appends line to data.csv
                  fs.appendFileSync(
                    "./output/data.csv",
                    country,
                    "utf-8",
                    err => {
                      console.log("Error apending");
                    }
                  );
                  countries += country;
                }
              );
              resolve();
            })
            .catch(err => {
              console.log(`ERROR:`, err);
              reject();
            });
        });
        arrayOfPromises.push(promise);
      });
    })
    .catch(err => {});
  await Promise.all(arrayOfPromises);
  return data;
}

scraper().then(data => {
  // fs.writeFile("./output/data.csv", data, "utf-8", err => {
  //   console.log("Error writing to file", err);
  // });
});

// const data = "test,test,test\nhello\n";
// fs.appendFileSync("./output/data.csv", data, "utf-8", err => {
//   console.log("Error apending");
// });
