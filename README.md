# Marvel Characters Investigation

This application retrieves information about Marvel characters using the Marvel API, filters characters by name, and saves the data to a MongoDB database.

## Prerequisites

1. Marvel API keys (public and private). You can obtain them by signing up for an account at [Marvel Developer Portal](https://developer.marvel.com/).
2. MongoDB URI for database connection.

## Installation

1. Clone this repository to your local machine.
2. Install dependencies by running `npm install`.

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:

MARVEL_PUBLIC_KEY=YOUR_PUBLIC_KEY
MARVEL_PRIVATE_KEY=YOUR_PRIVATE_KEY
CHARACTER_TO_FILTER=CharacterNameToFilter
MONGODB_URI=YourMongoDBURI

## Usage

1. Run the application by executing the following scripts in the terminal.
   `docker-compose up --build`
   `node marvel-api`
2. Marvel characters' information will be fetched, filtered, and saved to the MongoDB database.
3. Console logs will display the retrieved character information and any errors encountered during the process.

## Additional Notes

- Make sure you have a stable internet connection to fetch data from the Marvel API.
- Ensure that your MongoDB URI is correct and accessible.
- Modify the `.env` file to update the character name for filtering if needed.
