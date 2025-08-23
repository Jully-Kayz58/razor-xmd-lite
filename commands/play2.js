const axios = require('axios');
const ytdl = require('ytdl-core');
const { getContextInfo} = require('../utils/context');
const { getConfig} = require('../utils/config');

module.exports = {
  execute: async (sock, msg, args) => {
    const query = args.join(' ') + ' remix';
    const config = getConfig();
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!args.length) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗ Please provide a song name.',
        contextInfo: getContextInfo(sender, config)
});
}

    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const { data} = await axios.get(searchUrl);
      const videoId = data.match(/"videoId":"(.*?)"/)?.[1];
      if (!videoId) throw new Error('No remix found');

      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title;

      const audioStream = ytdl(videoUrl, {
        filter: 'audioonly',
        quality: 'highestaudio'
});

      await sock.sendMessage(msg.key.remoteJid, {
        audio: { stream: audioStream},
        mimetype: 'audio/mp4',
        ptt: false,
        contextInfo: getContextInfo(sender, config)
});

      await sock.sendMessage(msg.key.remoteJid, {
        text: `🎧 Remix playing: *${title}*`,
        contextInfo: getContextInfo(sender, config)
});

} catch {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ Could not find a remix version.',
        contextInfo: getContextInfo(sender, config)
});
}
}
};