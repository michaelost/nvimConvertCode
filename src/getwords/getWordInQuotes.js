
const fs = require('fs');
const os = require('os');

const getWordInQuotes = lines => {
  return lines.map(line => line.match(/\'.*\'/g,)[0])
}

const replaceWordInQuotesWithClipboardString = (lines, string) => {
  return lines.map(line => line.replace(/\'.*\'/, `'${string}'`).replace('\n', ''))
}

module.exports = {
  getWordInQuotes,
  replaceWordInQuotesWithClipboardString,
}
