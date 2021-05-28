const mongoose = require("mongoose");

//get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//load mongoose models
const Error = require("../models/error");
const Word = require("../models/word");

const { queryToWordID, rebuildCompactDefinition } = require("../misc");

const USING_COMPACT_DEFINITION = true;

let isConnected = false;

const connect = () => {
  if (isConnected) return Promise.resolve();
  return mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    });
};

module.exports = {
  getDefinition: async (query) => {
    await connect();
    let id = queryToWordID(query);
    if (id === "constructor") {
      //reserved keyword in object, cannot be used, we need to prefix it
      id = `_${id}`;
    }
    try {
      await connectToDatabase();
      const results = await Word.find({ id });
      let word = { id: results[0].id, definition: results[0].definition };
      return USING_COMPACT_DEFINITION
        ? rebuildCompactDefinition(JSON.parse(word.definition))
        : word;
    } catch (e) {
      return undefined;
    }
  },

  logError: async (description, message) => {
    await connect();
    const newError = new Error({
      date: new Date().toGMTString(),
      description: description,
      error: message,
    });
    return newError.save();
  },

  search: async (query) => {
    await connect();
    let id = queryToWordID(query);
    const regex = new RegExp(`^${id}`);
    if (id === "constructor") {
      //reserved keyword in object, cannot be used, we need to prefix it
      id = `_${id}`;
    }
    try {
      const words = await Word.find({ id: regex }, null, { limit: 10 });
      return words.map((word) => ({
        id: word.id,
        word: JSON.parse(word.definition).w,
      }));
    } catch (e) {
      return [];
    }
  },
};
