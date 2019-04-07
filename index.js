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
  return `  ${prop[0].toLowerCase()}: "${value}",`
}

const getWrappedArray = (array) => ['{', ...array, '}'];

module.exports = plugin => {
  plugin.setOptions({ dev: true });
  plugin.registerCommand('EchoMessage', async () => {
      try {
        const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
        const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
        const lineStart = startSelection[1];
        const lineEnd = endSelection[1];
        const line = await plugin.nvim.getLine(lineStart, lineEnd);
        const newString = convertArrowFunction(line);
        await plugin.nvim.buffer.replace([newString], lineStart -1); 
        await plugin.nvim.outWrite('fdsfsdasadfdf');
      } catch (err) {
        fs.writeFile(os.homedir() + '/vimerror.txt', JSON.stringify(err.message), function (err) {
          if (err) throw err;
        });
      }
    }, { sync: false });


  plugin.registerCommand('TOJS', async () => {
      try {
        const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
        const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");
        const lineStart = startSelection[1];
        const lineEnd = endSelection[1];
        const lines = await plugin.nvim.buffer.getLines({ start: lineStart, end: lineEnd });
        const res = lines
          .map(el => toJavascript(el))
          .filter(el => el);

        const wrapped = getWrappedArray(res);

        fs.writeFile(os.homedir() + '/vimerror.txt', JSON.stringify(wrapped), function (err) {
          if (err) throw err;
        });

        await plugin.nvim.buffer.replace(wrapped, lineStart -1); 

      } catch (err) {
        fs.writeFile(os.homedir() + '/vimerror.txt', JSON.stringify(err.message), function (err) {
          if (err) throw err;
        });
      }
    }, { sync: false });



  plugin.registerFunction('SetLines',() => {
    return plugin.nvim.setLine('May I offer you an egg in these troubling times')
      .then(() => console.log('Line should be set'))
  }, {sync: false})

  plugin.registerAutocmd('BufEnter', async (fileName) => {
    await plugin.nvim.buffer.append('BufEnter for a JS File?')
  }, {sync: false, pattern: '*.js', eval: 'expand("<afile>")'})
};
