const fs = require('fs');
const os = require('os');

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

const destructuring = (str) => {
  const startExp = /[a-z]{1,}\s\{/;
  const endExp = /\}\s{0,}\=.{1,}/;
  const middle = str
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

const getWrappedArray = (array) => ['{', ...array, '}'];

module.exports = plugin => {

  const getSelectedLine = async () => {
    const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
    const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
    const lineStart = startSelection[1];
    const lineEnd = endSelection[1];
    return await plugin.nvim.getLine(lineStart, lineEnd);
  }

  const getSelectedLines = async () => {
    const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
    const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
    const lineStart = startSelection[1];
    const lineEnd = endSelection[1];
    return await plugin.nvim.buffer.getLines({ start: lineStart, end: lineEnd });
  }


  const getLineStart = async () => {
    const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
    return startSelection[1];
  }

  const writeErrorToFile = (filePath, fileName) => {
    fs.writeFile(`${filePath}/fileName`, JSON.stringify(err.message), function (err) {
      if (err) throw err;
    });
  }

  plugin.setOptions({ dev: true });

  plugin.registerCommand('EchoMessage', async () => {
      try {
        const line = await getSelectedLine();
        const newString = convertArrowFunction(line);
        const lineStart = await getLineStart();
        await plugin.nvim.buffer.replace([newString], lineStart -1); 
        await plugin.nvim.outWrite('fdsfsdasadfdf');
      } catch (err) {
        writeErrorToFile(os.homedir(), 'vimerror.txt');
      }

    }, { sync: false });


  plugin.registerCommand('TOJS', async () => {
      try {
        const lines = await getSelectedLines();
        const res = lines
          .map(el => toJavascript(el))
          .filter(el => el);
        const wrapped = getWrappedArray(res);
        const lineStart = await getLineStart();
        await plugin.nvim.buffer.replace(wrapped, lineStart -1); 
      } catch (err) {
        writeErrorToFile(os.homedir(), 'vimerror.txt');
      }
    }, { sync: false });


  plugin.registerCommand('Destr', async () => {
    try {
      const lines = await getSelectedLine()
      const res = destructuring(lines)
      const lineStart = await getLineStart();
      await plugin.nvim.buffer.replace(res, lineStart -1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt');
    }
  }, { sync: false });

};

