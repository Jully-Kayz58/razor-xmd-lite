const axios = require("axios");
const cheerio = require("cheerio");
const { getConfig } = require("../utils/config");
const { getContextInfo } = require("../utils/context");

module.exports = {
    execute: async (sock, msg, args) => {
        const query = args.join(" ") || "nature";
        const config = getConfig();
        const sender = msg.key.participant || msg.key.remoteJid;

        try {
            // Step 1: Get DuckDuckGo token
            const tokenRes = await axios.get(
                `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
            );
            const tokenMatch = tokenRes.data.match(/vqd='(.+?)'/);
            if (!tokenMatch) throw new Error("Token not found");
            const vqd = tokenMatch[1];

            // Step 2: Fetch image results
            const imgRes = await axios.get(`https://duckduckgo.com/i.js`, {
                params: { l: "us-en", o: "json", q: query, vqd },
                headers: { "User-Agent": "Mozilla/5.0" }
            });

            const images = imgRes.data.results;
            if (!images || images.length === 0)
                throw new Error("No images found");

            const imageUrl = images[0].image;
            const title = images[0].title || query;

            // Step 3: Send image
            await sock.sendMessage(msg.key.remoteJid, {
                image: { url: imageUrl },
                caption: `🖼️ Image result for *${title}*`,
                contextInfo: getContextInfo(sender, config)
            });
        } catch (err) {
            console.error("Image fetch error:", err.message);
            await sock.sendMessage(msg.key.remoteJid, {
                text: "⚠️ Could not fetch image.",
                contextInfo: getContextInfo(sender, config)
            });
        }
    }
};
