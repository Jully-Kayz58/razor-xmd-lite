const axios = require('axios');
const ytdl = require('ytdl-core');
const { getContextInfo} = require('../utils/context');
const { getConfig} = require('../utils/config');

module.exports = {
  execute: async (sock, msg, args) => {
    const query = args.join(' ');
    const config = getConfig();
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!query) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗ Please provide a song name.',
        contextInfo: getContextInfo(sender, config)
});
}

    try {
      // Step 1: Search YouTube
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      const { data} = await axios.get(searchUrl);
      const videoId = data.match(/"videoId":"(.*?)"/)?.[1];

      if (!videoId) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: '⚠️ No results found.',
          contextInfo: getContextInfo(sender, config)
});
}

      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title;

      // Step 2: Download audio stream
      const audioStream = ytdl(videoUrl, {
        filter: 'audioonly',
        quality: 'highestaudio'
});

      // Step 3: Send audio
      await sock.sendMessage(msg.key.remoteJid, {
        audio: { stream: audioStream},
        mimetype: 'audio/mp4',
        ptt: false,
        contextInfo: getContextInfo(sender, config)
});

      // Optional: Send confirmation
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🎶 Now playing: *${title}*`,
        contextInfo: getContextInfo(sender, config)
});

} catch (err) {
      console.error('Error in.play command:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Failed to fetch or send audio.',
        contextInfo: getContextInfo(sender, config)
});
}
}
};
