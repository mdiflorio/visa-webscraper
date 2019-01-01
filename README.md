# Visa-Scraper

Visa-Scraper is a NodeJS scraper function to get all visa information for every nationality. It scrapes [wikipedia](https://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality) to get the data. The data is then written into a .CSV file in this format:

```
nationality; country, visaType, note
```

## Requirements

- NodeJS.
- Yarn or NPM package manager.
- A MySQL database which contains a table called 'restrictions'
- MyCLI to access your MySQL database.
- An .env file which contains three entries in the format.

```
  DB_host = hostname
  DB_user = username
  DB_pass = password
```

## Installation

To run the scraper, clone the repo.
Then run:

```bash
yarn install
yarn start
```

## Usage

The output will be located in ./output/data-nationalities.csv. You will also be able to locate a cleaned up version of the data in your MySQL database.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
