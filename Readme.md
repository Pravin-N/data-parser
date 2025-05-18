# File Parser

A TypeScript-based project for parsing log files, processing data, and exporting the results to a CSV file.

## Assumptions and Approach

1. Input log files need to be comma seperated and be in a specific format with specific headers (app, deviceToken, deviceTokenStatus, tag)
2. The output file will be result.csv in the root folder of the project.
3. The ini file needs to be named appCodes.ini and placed in the root of the project.
4. The tags parsing information was a bit confusing and I've made some assumptions based on what I thought the data should look like but I would go back to the product owner and get more clarification.
   - if a tag has 'downloaded_free' I've assigned has_downloaded_free_product to the record
   - if a tag has 'purchased' I've assigned has_downloaded_iap_product to the record.
   - if a tag has 'not' I've assigned to not_downloaded_free_product but I've added it to has downloaded_free_product_status as I believe putting it under has_downloaded_iap_product_status is incorrect.
   - Default value for tags column is subscription_unknown, downloaded_free_product_unknown, downloaded_iap_product_unknown respectively.
   - The remaining tags I've put it into the unknown_tags column to not lose record.
5. Approach was mainly break down the script into function with one responsibility example writing to csv, ini parser, log parser so thats its easier to read for a new dev and build on top of it and makes it easy to scale.

## Features

- **Log File Parsing**: Reads and processes `.log` files to extract structured data.
- **Tag Classification**: Classifies tags into predefined categories.
- **CSV Export**: Outputs the processed data into a CSV file.
- **Error Handling**: Robust error handling for file operations and data processing.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/file-parser.git
   cd file-parser
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Ensure you have a valid appCodes.ini file in the root directory.

## Usage

1. Run the project by providing the root directory containing log files:
   ```bash
   node parse.js /path/to/log/files
   ```
2. The processed data will be written to result.csv in the project directory.

## Configuration

1. appCodes.ini: A configuration file mapping app codes to their respective names. Example:
   ```bash
   app1=Application One
   app2=Application Two
   ```

## Development

1. Build the Project. Compile the TypeScript code into JavaScript:
   ```bash
   pnpm run build
   ```

## License

This project is licensed under the MIT License.
