const fs = require("fs");
const rp = require("request-promise");
const $ = require("cheerio");

module.exports = function scraper() {
  const BASE_URL = "https://en.wikipedia.org";
  const url = `${BASE_URL}/wiki/Category:Visa_requirements_by_nationality`;

  console.log("Scraping away...");

  // Clear file and write headers in CSV file
  const header = `nationality;country;visaType;duration;note;\n`;
  fs.writeFile("./output/data.csv", header, "utf-8", err => {
    if (err) {
      console.log("Error clearing and added header to file", err);
    }
  });

  // Get html from url
  rp(url)
    .then(html => {
      // Get list of links of different nationality requirement wiki pages.
      const nationalityRequirements = $(
        ".mw-category-group > ul > li > a",
        html
      );

      // Go through list of nationality links
      nationalityRequirements.map(i => {
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

        rp(options).then(nationalityHtml => {
          let countries = "";
          // Get each field in the table rows
          $(".sortable", nationalityHtml)
            .first()
            .find("tbody > tr > td > a")
            .each(function(i) {
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
                .replace(/\[.*\]/g, "") // Removes wiki citations in the format "[num]"
                .replace(/[\n\r]+/g, " ") // Removes any returns
                .trim();

              const country = `${nationalityName};${name};${visa};${duration};${note};\n`;

              // Appends line to data.csv
              fs.appendFileSync("./output/data.csv", country, "utf-8", err => {
                console.log("Error apending to file");
              });
              countries += country;
            });
        });
      });
    })
    .catch(err => {
      console.log("Error: ", err);
    });
};
