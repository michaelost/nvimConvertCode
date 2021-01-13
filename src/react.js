const getIndentation = str => str.replace(/(\s+)(.*)/, '$1')


const componentSingleLine = (lines) => {
  return getIndentation(lines[0]) + lines.join(' ').replace(/(\s)+/g, ' ')
}

const componentMultiLine = (lines) => {
  const firstLine = lines[0]
  const indentation = getIndentation(firstLine)
  const allLines = firstLine.split(' ').filter(el => el)
  return allLines.map((el, index) => {
    return (index === 0 || index === allLines.length - 1) ? `${indentation}${el}` : `  ${indentation}${el}`
  })
}

module.exports = {
  componentSingleLine,
  componentMultiLine,

}
