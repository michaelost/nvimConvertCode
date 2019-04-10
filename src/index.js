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
    .replace(/\s/g,'').split(",").map(el => '  ' + el + ',');
  const startRes = str.match(startExp);
  const endRes = str.match(endExp);
  const start = startRes && startRes[0];
  const end = endRes && endRes[0];

  if (start && end && middle) {
    return [ start, ...middle, end ];
  }

}

const getWrappedArray = (array) => ['{', ...array, '}'];
const getWrappedArray2 = (array) => ['[', ...array, ']'];

module.exports = {
  convertArrowFunction,
  getWrappedArray,
  destructuring,
  destructuringTabulation,
  toJavascript,
  toArray,
}


