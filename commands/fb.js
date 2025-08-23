const axios = require("axios");
const { getConfig } = require("../utils/config");
const { getContextInfo } = require("../utils/context");

module.exports = {
    execute: async (sock, msg, args) => {
        const url = args[0];
        const config = getConfig();
        const sender = msg.key.participant || msg.key.remoteJid;

        if (!url || !url.includes("facebook.com")) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: "❗ Please provide a valid Facebook video URL.",
                contextInfo: getContextInfo(sender, config)
            });
        }

        try {
            const res = await axios.get(
                `https://api.vevioz.com/api/button/facebook?url=${url}`
            );
            const videoUrl = res.data?.url || res.data?.hd || res.data?.sd;
            if (!videoUrl) throw new Error();

            await sock.sendMessage(msg.key.remoteJid, {
                video: { url: videoUrl },
                caption: "📘 Facebook video downloaded!",
                contextInfo: getContextInfo(sender, config)
            });
        } catch {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "⚠️ Failed to download Facebook video.",
                contextInfo: getContextInfo(sender, config)
            });
        }
    }
};
