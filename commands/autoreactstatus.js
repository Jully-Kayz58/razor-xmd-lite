const { getConfig, updateConfig } = require("../utils/config");
const { isOwner } = require("../utils/roles");

module.exports = {
    execute: async (sock, msg, args) => {
        if (!isOwner(msg)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: "⛔ Owner only command."
            });
        }

        const mode = args[0];
        if (!["on", "off"].includes(mode)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: "❗ Usage:.autoreactstatus on/off"
            });
        }

        const config = getConfig();
        config.autoreactstatus = mode === "on";
        updateConfig(config);

        await sock.sendMessage(msg.key.remoteJid, {
            text: `😎 Auto react to status is now *${mode.toUpperCase()}*.`
        });
    }
};
