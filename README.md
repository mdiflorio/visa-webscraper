# Visa-Scraper

Visa-Scraper is a NodeJS scraper function to get all visa information for every nationality. It scrapes [wikipedia](https://en.wikipedia.org/wiki/Category:Visa_requirements_by_nationality) to get the data. The data is then written into a .CSV file in this format:

```
Nationality, Country, Type of visa required, Note
```

## Installation

To run the scraper, clone the repo.
Then run:

```bash
yarn install
yarn start
```

## Usage

The output file will be located in output.
Be careful, this implementation uses append. So make sure to delete the last file if you run the scraper more than once.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
