module.exports = plugin => {
  plugin.setOptions({ dev: false });
  plugin.registerCommand('EchoMessage', async () => {
      try {
        const startSelection = await plugin.nvim.eval("getpos(\"'<\")");
        const endSelection =  await plugin.nvim.eval("getpos(\"'>\")");

        const lineStart = startSelection[1];
        const lineEnd = endSelection[1];

        const line = await plugin.nvim.getLine(lineStart, lineEnd);

        await plugin.nvim.outWrite(line);
      } catch (err) {

        await plugin.nvim.outWrite('err');
        console.error(err);
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
