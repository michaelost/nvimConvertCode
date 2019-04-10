const fs = require('fs');
const os = require('os');

const {
  convertArrowFunction,
  getWrappedArray,
  destructuring,
  destructuringTabulation,
  toJavascript,
} = require('./src/index');

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

  plugin.registerCommand('Arrow', async () => {
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


  plugin.registerCommand('D', async () => {
    try {
      const lines = await getSelectedLine()
      const res = destructuring(lines)
      const lineStart = await getLineStart();
      await plugin.nvim.buffer.replace(res, lineStart -1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt');
    }
  }, { sync: false });

  plugin.registerCommand('D2', async () => {
    try {
      const lines = await getSelectedLine()
      const res = destructuringTabulation(lines)
      const lineStart = await getLineStart();
      //await plugin.nvim.buffer.replace(res, lineStart -1); 
      await plugin.nvim.buffer.remove(lineStart -1,lineStart); 
      await plugin.nvim.buffer.insert(res, lineStart - 1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt');
    }
  }, { sync: false });

};

