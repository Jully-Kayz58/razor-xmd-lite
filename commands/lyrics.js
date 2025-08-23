const axios = require('axios');

module.exports = {
  execute: async (sock, msg, args) => {
    const query = args.join(' ');
    if (!query) return sock.sendMessage(msg.key.remoteJid, { text: '❗ Provide a song name.'});

    try {
      const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
      const lyrics = res.data.lyrics || 'Lyrics not found.';
      await sock.sendMessage(msg.key.remoteJid, { text: `📜 Lyrics for *${query}*:\n\n${lyrics.slice(0, 4000)}`});
} catch {
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Error fetching lyrics.'});
}
}
};
