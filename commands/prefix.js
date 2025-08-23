const { getConfig, updateConfig} = require('../utils/config');
const { isOwner} = require('../utils/roles');

module.exports = {
  execute: async (sock, msg, args) => {
    if (!isOwner(msg)) return sock.sendMessage(msg.key.remoteJid, { text: '⛔ Owner only command.'});

    const newPrefix = args[0];
    if (!newPrefix) return sock.sendMessage(msg.key.remoteJid, { text: '❗ Provide a new prefix.'});
    
    if (newPrefix > 1) {
      return sock.sendMessage(msg.key.remoteJid, {text: '! Prefix should only be 1 character'});
    }

    const config = getConfig();
    config.prefix = newPrefix;
    updateConfig(config);

    await sock.sendMessage(msg.key.remoteJid, { text: `✅ Prefix updated to *${newPrefix}*. \n > ${config.botName}`});
}
};