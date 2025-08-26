const { getConfig} = require('./config');

module.exports = {
  isOwner: (msg) => {
    const config = getConfig();
    const sender = msg.key.participant || msg.key.remoteJid;
    return sender.includes(config.ownerNumber);
},
  isAdmin: (msg, groupMetadata) => {
    const sender = msg.key.participant;
    const admin = groupMetadata?.participants?.find(p => p.id === sender && p.admin);
    return!!admin;
},
  isGroup: (msg) => msg.key.remoteJid.endsWith('@g.us')
};