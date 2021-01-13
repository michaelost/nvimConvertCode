const parser = require('node-html-parser')

const traverse = (object, field, resultArray) => {
  const fields = object[field]
  object.tagName && resultArray.push(object.tagName)
  if(!fields || !fields.length) return resultArray
  return resultArray.concat(
    fields.reduce((acc, el) => {
      const array = traverse(el, field, [])
      acc = array && array.length ? acc.concat(array) : acc
      return acc
    }, [])
  )
}

const getListOfTags = (code) => {
  const root = parser.parse(code);
  const tags = traverse(root, 'childNodes', [])
  const uniqueTags = tags.reduce((acc, element) => {
    acc = acc.indexOf(element) > -1 ? acc : acc.concat([element])
    return acc
  }, [])
  return uniqueTags
}

const createStyledComponentsForTags = (tags) => (
  tags.map(tag => {
    return `const ${tag} = styled.div\`\``
  })
);

const getPropsOutOfObject = (lines) => (
  lines.map(line => {
    const l = line.match(/\w*/g).map(el => el)[0]
    return `${l}={${l}}`
  })
);


module.exports = {
  getListOfTags,
  createStyledComponentsForTags,
  getPropsOutOfObject,

}

