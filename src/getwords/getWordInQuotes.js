
const fs = require('fs');
const os = require('os');

const getWordInQuotes = lines => {
  return lines.map(line => line.match(/\'.*\'/g,)[0])
}

module.exports = {
  getWordInQuotes,
}
