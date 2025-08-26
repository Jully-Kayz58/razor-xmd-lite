const {
    default: makeWArazoret,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { getConfig, updateConfig } = require("./utils/config");
const { isAllowed } = require("./utils/roles");
const { autoUpdate } = require("./utils/updater");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(
    "📱 Enter your phone number (with country code): ",
    async number => {
        const config = getConfig();
        config.ownerNumber = number;
        updateConfig(config);
        rl.close();

        const { state, saveCreds } = await useMultiFileAuthState("auth");
        const { version } = await fetchLatestBaileysVersion();

        const razor = makeWArazoret({
            version,
            auth: state,
            printQRInTerminal: false,
            browser: ["Razor XMD Lite", "Chrome", "1.0.0"]
        });

        // 🔗 Pairing code login
        razor.ev.on("connection.update", async update => {
            const { connection, pairingCode, isNewLogin } = update;
            if (pairingCode && isNewLogin) {
                console.log(`🔗 Pairing Code: ${pairingCode}`);
                console.log("📲 WhatsApp> Linked Devices> Enter Code");
            }
            if (connection === "open") console.log("✅ Razor XMD Connected");
        });

        // 🧠 Message handler
        razor.ev.on("messages.upsert", async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const config = getConfig();
            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                "";
            const [cmdRaw, ...args] = text.trim().split(" ");
            const cmd = cmdRaw.replace(config.prefix, "").toLowerCase();

            // 🔒 Mode enforcement
            if (!isAllowed(msg)) {
                return;
            }

            // 📖 Autoread
            if (config.autoread) {
                await razor.readMessages([msg.key]);
            }

            // 🎙️ Autorecord presence
            if (config.autorecord) {
                await razor.sendPresenceUpdate("recording", msg.key.remoteJid);
            }

            // 📝 Autobio
            if (config.autobio) {
                await razor.updateProfileStatus(
                    `🤖 Razor XMD Lite active as of ${new Date().toLocaleString()}`
                );
            }

            // 🔍 Command execution
            const commandPath = path.join(__dirname, "commands", `${cmd}.js`);
            if (fs.existsSync(commandPath)) {
                const command = require(commandPath);
                await command.execute(razor, msg, args);
            }
        });

        // 👋 Welcome messages
        razor.ev.on("group-participants.update", async update => {
            const config = getConfig();
            const { id, participants, action } = update;

            if (action === "add" && config.welcome) {
                for (const participant of participants) {
                    await razor.sendMessage(id, {
                        text: `👋 Welcome @${
                            participant.split("@")[0]
                        } to the group! \n > Powered By *Razor XMD Lite*`,
                        mentions: [participant]
                    });
                }
            }
        });

        // 👀 Autostatus view + react
        if (getConfig().autostatusview) {
            razor.ev.on("status.update", async ({ statuses }) => {
                for (const status of statuses) {
                    await razor.readMessages([
                        { remoteJid: status.id, id: status.statuses[0].id }
                    ]);

                    if (getConfig().autoreactstatus) {
                        await razor.sendMessage(status.id, {
                            react: {
                                text: "👀",
                                key: {
                                    id: status.statuses[0].id,
                                    remoteJid: status.id
                                }
                            }
                        });
                    }
                }
            });
        }

        // 💾 Save credentials
        razor.ev.on("creds.update", saveCreds);

        // 🌐 Always online
        if (getConfig().alwaysOnline) {
            setInterval(() => razor.sendPresenceUpdate("available"), 60000);
        }

        // 🔄 Auto-update from GitHub
        setInterval(autoUpdate, 300000); // every 5 minutes
    }
);
