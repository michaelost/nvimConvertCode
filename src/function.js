const {
  getTabulationString,
} = require('./index.js');

const getTabulationOfLine = (line) => line.replace(/^(\s{1,})(.{1,})/,'$1');
const addTabulationToLine = (line, tabulation) => tabulation.length ? tabulation + line : line;

/*
const wrapIntoFunction = (lines) => {
 // TODO: remove spaces
 // const formattedLines = lines.map(el => getTabulationString(2) + el.replace(/^\s{1,}(.{1,})/,'$1'));
  const firstTab = getTabulationOfLine(lines[0]);
  const formattedLines = lines.map(el => getTabulationString(2) + el);
  const title = (firstTab.length ? firstTab : '') + 'function someNewFunction () {';
  const end = (firstTab.length ? firstTab : '') + '}';
  return [title, ...formattedLines, end];
}
*/

const wrapIntoFunction = (lines) => {
  const firstTab = getTabulationOfLine(lines[0]);
  const formattedLines = lines.map(el => getTabulationString(2) + el);
  const title = addTabulationToLine('function someNewFunction () {', firstTab);
  const end =  addTabulationToLine('}', firstTab);
  return [title, ...formattedLines, end];
}

module.exports = {
  wrapIntoFunction,
}
