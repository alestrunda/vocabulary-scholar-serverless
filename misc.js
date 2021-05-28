const fs = require("fs");

module.exports = {
  sortByNameProp: (itemA, itemB) => {
    var nameA = itemA.name.toLowerCase();
    var nameB = itemB.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  },

  rebuildCompactDefinition: definition => ({
    id: definition.i,
    lexicalEntries: definition.l.map(lexicalEntry => ({
      entries: lexicalEntry.e.map(entry => ({
        senses: entry.s.map(sense => {
          const out = {
            definitions: sense.d
          };
          if (sense.x) {
            out.examples = sense.x.map(example => ({
              text: example
            }));
          }
          return out;
        })
      })),
      lexicalCategory: {
        text: lexicalEntry.c
      }
    })),
    word: definition.w
  }),

  readFile: fileName =>
    new Promise((resolve, reject) => {
      fs.readFile(fileName, "utf8", function(error, data) {
        if (error) return reject(error);
        resolve(data);
      });
    }),

  queryToWordID: query => query.toLowerCase().replace(/ /g, "_")
};
