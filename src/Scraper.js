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
    clearDataCSV(reject);

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
            let nationalityName = parseNationalityName(
              nationalityRequirements,
              i
            );

            // Get html from each nationality page
            let options = {
              uri: `${BASE_URL}${nationalityRequirements[i].attribs.href}`
            };

            rp(options).then(nationalityHtml => {
              // Get each field in the table rows
              $(".sortable", nationalityHtml)
                .first()
                .find("tbody > tr > td > a")
                .each(function(i) {
                  let countryRow = createRowEntry(nationalityName, $(this));

                  // Appends line to data.csv
                  appendToCSV(countryRow, "./output/data.csv", reject);

                  // Resolve promise on very last item.
                  resolveIfLastItem(
                    urlIndex,
                    urls,
                    i,
                    nationalityRequirements,
                    resolve
                  );
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

function resolveIfLastItem(
  urlIndex,
  urls,
  i,
  nationalityRequirements,
  resolve
) {
  if (urlIndex == urls.length - 1 && i == nationalityRequirements.length - 1) {
    resolve();
  }
}

function parseNationalityName(nationalityRequirements, i) {
  let nationalityName = nationalityRequirements[i].attribs.title;
  nationality = nationalityName
    .split("Visa requirements for")
    .pop()
    .split("citizens")
    .shift()
    .trim();

  if (nationality == "Chinese") {
    const containsHongKong = nationalityName.match(/(Hong Kong)/g);
    const containsMacau = nationalityName.match(/(Macau)/g);
    if (containsHongKong) {
      nationality = "Chinese (Hong Kong)";
    } else if (containsMacau) {
      nationality = "Chinese (Macau)";
    }
  }

  return nationality;
}

function appendToCSV(text, file, reject) {
  fs.appendFileSync(file, text, "utf-8", err => {
    console.log("Error apending to file");
    reject("Error apending to file");
  });
}

function createRowEntry(nationalityName, context) {
  let name = context
    .text()
    .replace(/\[.*\]/g, "") // Removes wiki citations in the format "[num]"
    .replace(/[\n\r]+/g, " ") // Removes any returns or newlines.
    .trim();
  let visa = context
    .parent()
    .next()
    .text()
    .replace(/\[.*\]/g, "")
    .replace(/[\n\r]+/g, " ")
    .trim();
  let duration = context
    .parent()
    .next()
    .next()
    .text()
    .replace(/\[.*\]/g, "")
    .replace(/[\n\r]+/g, " ")
    .trim();
  let note = context
    .parent()
    .next()
    .next()
    .next()
    .text()
    .replace(/\[.*\]/g, "")
    .replace(/[\n\r]+/g, " ")
    .trim();
  let country = `${nationalityName};${name};${visa};${duration};${note};\n`;
  return country;
}

function clearDataCSV(reject) {
  const header = `nationality;country;visaType;duration;note;\n`;
  fs.writeFile("./output/data.csv", header, "utf-8", err => {
    if (err) {
      console.log("Error clearing and added header to file", err);
      reject(err);
    }
  });
}
