const fs = require("fs");
const rp = require("request-promise");
const $ = require("cheerio");

module.exports = function scraper() {
  const BASE_URL = "https://en.wikipedia.org";
  const urls = [
    `${BASE_URL}/wiki/Category:Visa_requirements_by_nationality`,
    `${BASE_URL}/w/index.php?title=Category:Visa_requirements_by_nationality&pagefrom=Turkey%0AVisa+requirements+for+Turkish+citizens#mw-pages`
  ];

  console.log("Scraping away...");

  return new Promise((resolve, reject) => {
    // Clear file and write headers in CSV file
    const header = `nationality;country;visaType;duration;note;\n`;
    fs.writeFile("./output/data.csv", header, "utf-8", err => {
      if (err) {
        console.log("Error clearing and added header to file", err);
        reject(err);
      }
    });

    urls.forEach((url, urlIndex) => {
      // Get html from urls
      rp(url)
        .then(html => {
          // Get list of links of different nationality requirement wiki pages.
          const nationalityRequirements = $(
            ".mw-category-group > ul > li > a",
            html
          );

          // Go through list of nationality links
          nationalityRequirements.map((i, natIndex) => {
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

            // Appends line to data.csv
            fs.appendFileSync(
              "./output/data-nationalities.csv",
              `${nationalityName};\n`,
              "utf-8",
              err => {
                console.log("Error apending to file");
                reject("Error apending to file");
              }
            );

            rp(options).then(nationalityHtml => {
              // Get each field in the table rows
              $(".sortable", nationalityHtml)
                .first()
                .find("tbody > tr > td > a")
                .each(function(i) {
                  let name = $(this)
                    .text()
                    .replace(/\[.*\]/g, "") // Removes wiki citations in the format "[num]"
                    .replace(/[\n\r]+/g, " ") // Removes any returns or newlines.
                    .trim();
                  let visa = $(this)
                    .parent()
                    .next()
                    .text()
                    .replace(/\[.*\]/g, "")
                    .replace(/[\n\r]+/g, " ")
                    .trim();
                  let duration = $(this)
                    .parent()
                    .next()
                    .next()
                    .text()
                    .replace(/\[.*\]/g, "") // Removes wiki citations in the format "[num]"
                    .replace(/[\n\r]+/g, " ")
                    .trim();
                  let note = $(this)
                    .parent()
                    .next()
                    .next()
                    .next()
                    .text()
                    .replace(/\[.*\]/g, "") // Removes wiki citations in the format "[num]"
                    .replace(/[\n\r]+/g, " ")
                    .trim();

                  let country = `${nationalityName};${name};${visa};${duration};${note};\n`;
                  country = country;

                  // Appends line to data.csv
                  fs.appendFileSync(
                    "./output/data.csv",
                    country,
                    "utf-8",
                    err => {
                      console.log("Error apending to file");
                      reject("Error apending to file");
                    }
                  );

                  // Resolve promise on very last item.
                  if (
                    urlIndex == urls.length - 1 &&
                    i == nationalityRequirements.length - 1
                  ) {
                    resolve();
                  }
                });
            });
          });
        })
        .catch(err => {
          console.log("Error: ", err);
          reject(err);
        });
    });
  });
};
