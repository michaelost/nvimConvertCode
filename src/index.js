const convertArrowFunction = (str) => {
  const regExp = /(\()([a-zA-z\s0-9]{1,}\))(\s\=\>\s)/;
  const body = str.replace(regExp, '');
  const head = str.match(regExp)[0];
  return `${head} { return ${body}; }`;
}

const toJavascript = (str) => {
  const regExp = /^[A-Za-z]*\s/;
  const prop = str.match(regExp, '');
  const value = str.replace(regExp, '');
  if (!prop || !prop.length || !value) {
    return '';
  }
  return `  ${prop[0].toLowerCase().replace(/\s/g, '')}: "${value}",`
}

const toArray = (strArray) => getWrappedArray2(strArray.filter(el => el).map(el => (`  "${el}", `)));
const toArrayInline = (strArray) => getWrappedArray2(strArray.filter(el => el).map(el => (`"${el}", `))).join('');

const destructuring = (str) => {
  const startExp = /[a-z]{1,}\s\{/;
  const endExp = /\}\s{0,}\=.{1,}/;
  let middle = str
    .replace(startExp, '')
    .replace(endExp, '');
  const startRes = str.match(startExp);
  const endRes = str.match(endExp);
  const start = startRes && startRes[0];
  const end = endRes && endRes[0];
  if (start && end && middle) {
    return [ start, middle, end ];
  }

}

const destructuringTabulation = (str) => {
  const startExp = /[a-z]{1,}\s\{/;
  const endExp = /\}\s{0,}\=.{1,}/;
  let middle = str
    .replace(startExp, '')
    .replace(endExp, '')
    .replace(/\s/g,'').split(",").map(el => '  ' + el + ',')
    .filter(el => el.replace(/[\s\,]/g, '').length);
  const startRes = str.match(startExp);
  const endRes = str.match(endExp);
  const start = startRes && startRes[0];
  const end = endRes && endRes[0];

  if (start && end && middle) {
    return [ start, ...middle, end ];
  }

}

const destructuringTabulationRevert = (lines = []) => lines.join('').replace(/[\n]/g, '').replace(/\s\s+/g, ' ');

const getTabulationString = (count) => {
  let tab = '';
  let tempTab = count;
  while(tempTab) {
    tempTab--;
    tab += ' ';
  }
  return tab;
}

const destructuringTabulationProps = (str) => {
  const props = str.split(',');
  const tabulation = props[0].length - props[0].replace(/\s/g, '').length;
  const tabString = getTabulationString(tabulation);
  return props
    .filter(el => el.replace(/[\s]/g, '').length)
    .map((el, index) => (index == 0 ? `${el},` : `${tabString}${el.replace(/\s/g, '')},`));
}

const destructuringTabulationPropsToOneString = (lines) => {
  const tabulation = lines[0].length - lines[0].replace(/\s/g, '').length;
  const tabString = getTabulationString(tabulation);
  return lines 
    .filter(el => el)
    .map((el, index) => (index == 0 ? `${el} ` : `${el.replace(/\s/g, '')} `))
    .join('');
}

const convertWordsToDestructuringAssignment = (str) => {
  const props = str.replace(/[.=*,]/g, '').split(' ').filter(el => el).join(', ');
  return `const { ${props} } = `;
}

const jsToJSON = (str) => {
  return str.map(el => el
    .replace(/[\'\"]/g, '')
    .replace(/(\s{1,})([a-zA-Z0-9]{1,}):(.{1,}),/g, '$1\"$2\": \"$3\",')
    .replace(/(\s{1,})([a-zA-Z0-9]{1,}):(.{1,})/g, '$1\"$2\": \"$3\"')
  )
  .filter(el => el)
}

const getWrappedArray = (array) => ['{', ...array, '}'];
const getWrappedArray2 = (array) => ['[', ...array, ']'];

const getOnlyPropsFromObject = (str) => str.replace(/([a-zA-Z_0-9]{1,})(.{1,})/g, '$1,').replace(/[\n\.]/g, '').replace(/\s{2,}/g,' ');

module.exports = {
  convertArrowFunction,
  getWrappedArray,
  destructuring,
  destructuringTabulation,
  toJavascript,
  toArray,
  toArrayInline,
  destructuringTabulationProps,
  destructuringTabulationPropsToOneString,
  destructuringTabulationRevert,
  convertWordsToDestructuringAssignment,
  jsToJSON,
  getTabulationString,
  getOnlyPropsFromObject,
}

