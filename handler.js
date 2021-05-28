"use strict";

const dotenv = require("dotenv");
dotenv.config();

const {
  responseError,
  responseRedirect,
  responseSuccess,
} = require("./objects/response");

const {
  getDefinition: getDefinitionDb,
  logError: logErrorDb,
  search: searchDb,
} = require("./objects/db");
const searchService = require("./services/dictionary");
const translationService = require("./services/translation");
const { sortByNameProp } = require("./misc");

module.exports = {
  getDictionary: async (event) => {
    return responseRedirect(
      `${process.env.S3_URL}/dictionaries/${event.pathParameters.filename}`
    );
  },

  getEntry: async (event) => {
    try {
      const results = await searchService.search(event.pathParameters.word);
      return responseSuccess(results);
    } catch (e) {
      const word = await getDefinitionDb(event.pathParameters.word);
      if (word) {
        return responseSuccess([word]);
      } else if (e.response) return responseError(e.response.statusText);
      return responseError();
    }
  },

  getList: async (event) => {
    return responseRedirect(
      `${process.env.S3_URL}/lists/${event.pathParameters.filename}`
    );
  },

  getLists: async () => {
    const lists = require("./data/lists").map((list) => ({
      ...list,
      url: `${process.env.S3_URL}/lists/${list.filename}`,
    }));
    return responseSuccess(lists);
  },

  languages: async () => {
    try {
      const data = await translationService.getLanguages();
      const languages = Object.entries(data.translation).map((item) => {
        const languageCode = item[0];
        return {
          code: languageCode,
          ...item[1],
        };
      });
      languages.sort(sortByNameProp);
      return responseSuccess(languages);
    } catch (e) {
      if (e.response) return responseError(e.response.statusText);
      return responseError();
    }
  },

  logError: async (event) => {
    try {
      const error = JSON.parse(event.body);
      await logErrorDb(error.description, error.error);
      return responseSuccess();
    } catch (e) {
      console.error(e);
    }
  },

  search: async (event) => {
    const query = event.pathParameters && event.pathParameters.query;
    if (!query) return responseError("Missing search query");
    try {
      const words = await searchDb(query);
      return responseSuccess(words);
    } catch (e) {
      if (e.response) return responseError(e.response.statusText);
      return responseError();
    }
  },

  translate: async (event) => {
    const langTo =
      event.queryStringParameters && event.queryStringParameters.to;
    const query =
      event.queryStringParameters && event.queryStringParameters.word;
    if (!langTo || !query) return responseError("Missing required paramaters");
    try {
      return responseSuccess(
        await translationService.translate("en", langTo, query)
      );
    } catch (e) {
      console.error(e);
      if (e.response) return responseError(e.response.statusText);
      return responseError();
    }
  },
};
