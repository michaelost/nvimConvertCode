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
  destructuringTabulationPropsToOneString,
  destructuringTabulationRevert,
} = require('./src/index');

module.exports = plugin => {

  const getSelectedLine = async () => {
    const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
    const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
    const lineStart = startSelection[1];
    const lineEnd = endSelection[1];
    return await plugin.nvim.getLine(lineStart, lineEnd);
  }

  const getSelectedLines = async (start, end) => {
    if (start && end) {
      return await plugin.nvim.buffer.getLines({ start, end });
    }
    const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
    const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
    const lineStart = startSelection[1];
    const lineEnd = endSelection[1];
    return await plugin.nvim.buffer.getLines({ start: lineStart, end: lineEnd });
  }

  const getSelectedLinesRange = async () => {
    const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
    const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
    const lineStart = startSelection[1];
    const lineEnd = endSelection[1];
    return { start: lineStart, end: lineEnd };
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

  /*
    converts:
      const { retrieveData, handleError, formatResponseMiddleware,  } = require('../middlewares');
    to:

    const {
      retrieveData, handleError, formatResponseMiddleware,  
    } = require('../middlewares');
  */

  plugin.registerCommand('D', async () => {
    try {

      const { start, end } = await getSelectedLinesRange();
      let lines = await getSelectedLines(start -1, end);
      if (Array.isArray(lines) && lines.length == 1) {
        lines = lines[0];
      }

      const lineStart = await getLineStart();
      const res = destructuring(lines)
      writeErrorToFile(os.homedir(), 'vimerror.txt', lines);

      await plugin.nvim.buffer.remove(lineStart -1, lineStart); 
      await plugin.nvim.buffer.insert(res, lineStart - 1); 

//      await plugin.nvim.buffer.replace(res, lineStart -1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt', err.message);
    }
  }, { sync: false });


  /*
    converts:
      const { retrieveData, handleError, formatResponseMiddleware,  } = require('../middlewares');
    to:

    const {
      retrieveData,
      handleError,
      formatResponseMiddleware,  
    } = require('../middlewares');
  */
  plugin.registerCommand('D2', async () => {
    try {
      const lines = await getSelectedLine()
      const res = destructuringTabulation(lines)
      const lineStart = await getLineStart();
      await plugin.nvim.buffer.remove(lineStart -1,lineStart); 
      await plugin.nvim.buffer.insert(res, lineStart - 1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt');
    }
  }, { sync: false });



  /*
    converts 
      const {
       retrieveData,
       handleError,
       formatResponseMiddleware,
      } = require('../middlewares');
    to
      const { retrieveData, handleError, formatResponseMiddleware, } = require('../middlewares');

  */

  plugin.registerCommand('D3', async () => {
    try {
      const { start, end } = await getSelectedLinesRange();
      let lines = await getSelectedLines(start -1, end);

      const res = destructuringTabulationRevert(lines)
      await plugin.nvim.buffer.remove(start -1, end); 
      await plugin.nvim.buffer.insert(res, start - 1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt');
    }
  }, { sync: false });


/*
  converts:
    error, data, dataType, owner, stepId, incidentId, 
  to:
    error,
    data,
    dataType,
    owner,
    stepId,
    incidentId,
*/

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

/*
  converts:
    error,
    data,
    dataType,
    owner,
    stepId,
    incidentId,
  to:
    error, data, dataType, owner, stepId, incidentId, 
*/

  plugin.registerCommand('P2', async () => {
    try {
      const { start, end } = await getSelectedLinesRange();
      const lines = await getSelectedLines(start -1, end);
      writeErrorToFile(os.homedir(), 'vimerror.txt', lines);
      await plugin.nvim.buffer.remove(start -1, end); 
      const res = destructuringTabulationPropsToOneString(lines)
      await plugin.nvim.buffer.insert(res, start -1); 
    } catch (err) {
      writeErrorToFile(os.homedir(), 'vimerror.txt', err.message);
    }
  }, { sync: false });



};

