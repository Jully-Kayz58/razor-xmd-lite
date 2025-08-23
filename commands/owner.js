const { getConfig} = require('../utils/config');

module.exports = {
  execute: async (sock, msg) => {
    const config = getConfig();
    await sock.sendMessage(msg.key.remoteJid, { text: `👑 Owner: ${config.ownerName} \n Contact: ${config.ownerNumber} \n \n Channel: ${config.channel}> Powered By ${config.botName}`});
}
};