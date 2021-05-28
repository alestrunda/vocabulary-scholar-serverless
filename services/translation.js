const axios = require("axios");

const API_VERSION = "3.0";

module.exports = {
  getLanguages: async () => {
    const response = await axios.get(
      `${process.env.API_TRANSLATION_URI}/languages?api-version=${API_VERSION}`
    );
    return response.data;
  },

  translate: async (langFrom, langTo, query) => {
    const response = await axios({
      url: `${process.env.API_TRANSLATION_URI}/translate`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.API_TRANSLATION_KEY,
      },
      params: {
        "api-version": API_VERSION,
        from: langFrom,
        to: langTo,
      },
      data: [
        {
          text: query,
        },
      ],
    });
    return response.data[0].translations[0].text.toLowerCase();
  },
};
