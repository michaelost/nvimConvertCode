const fs = require('fs');
const os = require('os');

const {
  convertArrowFunction,
  getWrappedArray,
  destructuring,
  destructuringTabulation,
  toJavascript,
  toArray,
  toArrayInline,
  destructuringTabulationProps,
  destructuringTabulationPropsToOneString
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

  const getLineEnd = async () => {
    const endSelection = await plugin.nvim.eval("getpos(\"'>\")");
    return endSelection[1];
  }

  const writeErrorToFile = (filePath, fileName, data) => {
    fs.writeFile(`${filePath}/${fileName}`, JSON.stringify(data), function (err) {
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

  plugin.registerCommand('Arr', async () => {
      try {
        const lines = await getSelectedLines();
        const array = toArray(lines); 
        const lineStart = await getLineStart();
        writeErrorToFile(os.homedir(), 'vimerror.txt', array);
        await plugin.nvim.buffer.remove(lineStart -1,lineStart); 
        await plugin.nvim.buffer.replace(array, lineStart -1); 
      } catch (err) {
        writeErrorToFile(os.homedir(), 'vimerror.txt', err.message);
      }
    }, { sync: false });

  plugin.registerCommand('Arr2', async () => {
      try {
        const lines = await getSelectedLines();
        const array = toArrayInline(lines);
        const lineStart = await getLineStart();
        const lineEnd = await getLineEnd();
        writeErrorToFile(os.homedir(), 'vimerror.txt', array);
        await plugin.nvim.buffer.remove(lineStart, lineEnd); 
        await plugin.nvim.buffer.replace(array, lineStart -1); 
      } catch (err) {
        writeErrorToFile(os.homedir(), 'vimerror.txt', err.message);
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

  plugin.registerCommand('P1', async () => {
    try {
      const line = await getSelectedLine()
      const res = destructuringTabulationProps(line)
      const lineStart = await getLineStart();
      writeErrorToFile(os.homedir(), 'vimerror.txt', res);
      await plugin.nvim.buffer.remove(lineStart -1, lineStart); 
      await plugin.nvim.buffer.insert(res, lineStart - 1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt', err);
    }
  }, { sync: false });

  plugin.registerCommand('P2', async () => {
    try {
      const lines = await getSelectedLines()
      const res = destructuringTabulationPropsToOneString(lines)
      const lineStart = await getLineStart();
      const lineEnd = await getLineEnd();

      writeErrorToFile(os.homedir(), 'vimerror.txt', lines);
      await plugin.nvim.buffer.remove(lineStart -1, lineEnd); 
      await plugin.nvim.buffer.insert(res, lineStart -1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt', err.message);
    }
  }, { sync: false });

};

