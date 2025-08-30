const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { getConfig, updateConfig} = require("./utils/config");
const { isAllowed} = require("./utils/roles");
const { autoUpdate} = require("./utils/updater");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("📱 Enter your phone number (with country code): ", async number => {
  rl.close();

  const config = getConfig();
  config.ownerNumber = number;
  updateConfig(config);

  const { state, saveCreds} = await useMultiFileAuthState("auth");
  const { version} = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys)
},
    printQRInTerminal: false,
    browser: ["Razor XMD Lite", "Chrome", "1.0.0"]
});

  // Wait for connection before requesting pairing code
  socket.ev.on("connection.update", async update => {
    const { connection} = update;
    if (connection === "open") {
      try {
        const pairingCode = await socket.requestPairingCode(number);
        console.log(`🔗 Pairing Code: ${pairingCode}`);
        console.log("📲 WhatsApp> Linked Devices> Enter Code");
} catch (err) {
        console.error("❌ Failed to get pairing code:", err.message);
}

      console.log("✅ Razor XMD Connected");
}
});

  socket.ev.on("messages.upsert", async ({ messages}) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";
    const [cmdRaw,...args] = text.trim().split(" ");
    const cmd = cmdRaw.replace(config.prefix, "").toLowerCase();

    if (!isAllowed(msg)) return;

    if (config.autoread) {
      await socket.readMessages([msg.key]);
}

    if (config.autorecord) {
      await socket.sendPresenceUpdate("recording", msg.key.remoteJid);
}

    if (config.autobio) {
      await socket.updateProfileStatus(
        `🤖 Razor XMD Lite active as of ${new Date().toLocaleString()}`
);
}

    const commandPath = path.join(__dirname, "commands", `${cmd}.js`);
    if (fs.existsSync(commandPath)) {
      const command = require(commandPath);
      await command.execute(socket, msg, args);
}
});

  socket.ev.on("group-participants.update", async update => {
    const { id, participants, action} = update;
    if (action === "add" && config.welcome) {
      for (const participant of participants) {
        await socket.sendMessage(id, {
          text: `👋 Welcome @${
            participant.split("@")[0]
} to the group! \n> Powered By *Razor XMD Lite*`,
          mentions: [participant]
});
}
}
});

  if (config.autostatusview) {
    socket.ev.on("status.update", async ({ statuses}) => {
      for (const status of statuses) {
        await socket.readMessages([
          { remoteJid: status.id, id: status.statuses[0].id}
        ]);

        if (config.autoreactstatus) {
          await socket.sendMessage(status.id, {
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

  socket.ev.on("creds.update", saveCreds);

  if (config.alwaysOnline) {
    setInterval(() => socket.sendPresenceUpdate("available"), 60000);
}

  setInterval(autoUpdate, 300000); // every 5 minutes
});