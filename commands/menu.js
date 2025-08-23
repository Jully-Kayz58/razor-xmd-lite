const fs = require('fs');
const path = require('path');
const { getConfig} = require('../utils/config');
const { getContextInfo} = require('../utils/context');

module.exports = {
  execute: async (sock, msg) => {
    const config = getConfig();
    const sender = msg.key.participant || msg.key.remoteJid;

    const menuText = `
╭─✩ *${config.botName}* ✩─╮
│ Mode: *${config.mode}*
│ Owner: *${config.OWNER_NAME || 'Unknown'}*
╰────────────────────╯

╭─✧ *Media Tools* ✧─╮
│ •.play
│ •.song
│ •.lyrics
│ •.video
│ •.tiktok
│ •.fb
│ •.img
╰────────────────────╯

╭─✧ *Bot Controls* ✧─╮
│ •.owner
│ •.prefix
│ •.mode
│ •.alwaysonline on/off
│ •.autoread on/off
│ •.autobio on/off
│ •.autoreactstatus on/off
│ •.autorecord on/off
│ •.block
╰────────────────────╯

╭─✧ *Group Features* ✧─╮
│ •.welcome
╰────────────────────╯

╰─✩ Powered by *${config.botName}* ✩─╯
`;

    const imagePath = path.join(__dirname, '..', 'assets', 'menu.jpg');
    const imageBuffer = fs.readFileSync(imagePath);

    await sock.sendMessage(msg.key.remoteJid, {
      image: imageBuffer,
      caption: menuText,
      contextInfo: getContextInfo(sender, config)
});
}
};
