const axios = require("axios");

module.exports = {
  search: async (query) => {
    const response = await axios.get(
      `${process.env.API_DICTIONARY_URI}/entries/en-gb/${query}`,
      {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          app_id: process.env.API_DICTIONARY_ID,
          app_key: process.env.API_DICTIONARY_KEY,
        },
        withCredentials: true,
      }
    );
    if (
      response.data.results &&
      response.data.results[0] &&
      response.data.results[0].id === "constructor"
    ) {
      //reserved keyword in object, cannot be used, we need to prefix it
      response.data.results[0].id = `_${response.data.results[0].id}`;
    }
    return response.data.results;
  },
};
