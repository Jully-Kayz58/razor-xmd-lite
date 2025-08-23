const { getConfig, updateConfig } = require("../utils/config");
const { isAdmin, isGroup } = require("../utils/roles");

module.exports = {
    execute: async (sock, msg, args) => {
        if (!isGroup(msg)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: "❗ This command only works in groups."
            });
        }

        if (!(await isAdmin(sock, msg))) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: "⛔ Admin only command."
            });
        }

        const mode = args[0];
        if (!["on", "off"].includes(mode)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: "❗ Usage:.welcome on/off"
            });
        }

        const config = getConfig();
        config.welcome = mode === "on";
        updateConfig(config);

        await sock.sendMessage(msg.key.remoteJid, {
            text: `👋 Welcome messages are now *${mode.toUpperCase()}*.`
        });
    }
};
