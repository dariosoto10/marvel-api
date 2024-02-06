require("dotenv").config();
const axios = require("axios");
const { MongoClient } = require("mongodb");

const publicKey = process.env.MARVEL_PUBLIC_KEY;
const privateKey = process.env.MARVEL_PRIVATE_KEY;
const characterToFilter = process.env.CHARACTER_TO_FILTER;

// MongoDB connection string
const mongoUri = process.env.MONGO_URI;

const generateHash = () => {
  const timestamp = new Date().getTime();
  const hash = require("crypto")
    .createHash("md5")
    .update(timestamp + privateKey + publicKey)
    .digest("hex");
  return { ts: timestamp, apikey: publicKey, hash: hash };
};

const logCharacterInfo = (character) => {
  const { id, name, description, thumbnail } = character;
  const picture = `${thumbnail.path}.${thumbnail.extension}`;

  console.log(`- ID: ${id}`);
  console.log(`- Name: ${name}`);
  console.log(`- Description: ${description}`);
  console.log(`- Picture: ${picture}`);
  console.log(` `);
};

const saveCharacterToMongo = async (character) => {
  const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("marvelDB");
    const collection = database.collection("characters");
    await collection.insertOne(character);
  } finally {
    await client.close();
  }
};

const getMarvelCharacters = async () => {
  try {
    const { ts, apikey, hash } = generateHash();
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${apikey}&hash=${hash}&limit=100`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.data && response.data.data.results) {
      const characters = response.data.data.results;
      console.log("Characters Found:");

      characters.forEach((character) => {
        logCharacterInfo(character);
      });

      const filteredCharacter = characters.find(
        (character) =>
          character.name.toLowerCase() === characterToFilter.toLowerCase()
      );

      if (filteredCharacter) {
        console.log(`${characterToFilter} Information: `);
        logCharacterInfo(filteredCharacter);
        await saveCharacterToMongo(filteredCharacter);

        if (filteredCharacter.comics && filteredCharacter.comics.items) {
          for (const comic of filteredCharacter.comics.items) {
            await getCharactersInComic(comic.resourceURI);
          }
        }
      } else {
        console.error(`The character: ${characterToFilter}, not found.`);
      }
    } else {
      console.error("Error retrieving Marvel characters:", response.data);
    }
  } catch (error) {
    console.error("Error making API call or saving to MongoDB:", error.message);
  }
};

const getCharactersInComic = async (comicURI) => {
  try {
    const { ts, apikey, hash } = generateHash();
    const apiUrl = `${comicURI}?ts=${ts}&apikey=${apikey}&hash=${hash}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.data && response.data.data.results) {
      const comic = response.data.data.results[0];

      if (comic.characters && comic.characters.items) {
        console.log(`Characters in Comic (${comic.title}):`);
        comic.characters.items.forEach((character) => {
          console.log(`- ${character.name}`);
        });
      }
    } else {
      console.error("Error retrieving characters in comic:", response.data);
    }
  } catch (error) {
    console.error("Error making API call:", error.message);
  }
};

getMarvelCharacters();
