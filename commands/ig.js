const axios = require('axios');
const { getConfig} = require('../utils/config');
const { getContextInfo} = require('../utils/context');

module.exports = {
  execute: async (sock, msg, args) => {
    const url = args[0];
    const config = getConfig();
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!url ||!url.includes('instagram.com')) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗ Please provide a valid Instagram URL.',
        contextInfo: getContextInfo(sender, config)
});
}

    try {
      const res = await axios.get(`https://api.saveinsta.app/api/ajaxSearch?url=${url}`);
      const mediaUrl = res.data?.media?.[0]?.url;
      if (!mediaUrl) throw new Error();

      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: mediaUrl},
        caption: '📸 Instagram media downloaded!',
        contextInfo: getContextInfo(sender, config)
});
} catch {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ Failed to download Instagram media.',
        contextInfo: getContextInfo(sender, config)
});
}
}
};