const { getConfig, updateConfig} = require('../utils/config');
const { isOwner} = require('../utils/roles');

module.exports = {
  execute: async (sock, msg, args) => {
    if (!isOwner(msg)) {
      return sock.sendMessage(msg.key.remoteJid, { text: '⛔ Owner only command.'});
}

    const mode = args[0];
    if (!['on', 'off'].includes(mode)) {
      return sock.sendMessage(msg.key.remoteJid, { text: '❗ Usage:.autobio on/off'});
}

    const config = getConfig();
    config.autobio = mode === 'on';
    updateConfig(config);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📝 Auto bio update is now *${mode.toUpperCase()}*.`
});
}
};