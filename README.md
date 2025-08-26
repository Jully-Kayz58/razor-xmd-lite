<p align="center">
  <img src="assets/menu.jpg" alt="Razor XMD Lite Banner" width="100%">
</p>

<h1 align="center">⚡ Razor XMD Lite 🤖</h1>
<p align="center">
  <i>A blazing-fast, modular WhatsApp MD bot built for control, creativity, and automation.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/yourusername/razor-xmd-lite?style=for-the-badge" />
  <img src="https://img.shields.io/github/forks/yourusername/razor-xmd-lite?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

---

## ✨ Features

```
╭─✩ Core Commands ✩─╮
│ •.play              → Play a song
│ •.play2             → Play remix version
│ •.song              → Download song (audio + video)
│ •.lyrics            → Fetch lyrics
│ •.video             → Download YouTube video
│ •.tiktok            → Download TikTok (no watermark)
│ •.fb                → Download Facebook video
│ •.img               → Search image 
╰────────────────────╯

╭─✧ Bot Controls ✧─╮
│ •.prefix            → Change prefix 
│ •.mode              → Toggle public/private
│ •.alwaysonline on/off
│ •.autoread on/off
│ •.autobio on/off
│ •.autoreactstatus on/off
│ •.autostatusview on/off
│ •.autorecord on/off
│ •.block             → Block user 
╰────────────────────╯

╭─✧ Group Features ✧─╮
│ •.welcome on/off    → Welcome new members
╰────────────────────╯
```

---

## 🚀 Getting Started

### 🔧 Installation

```bash
git clone https://github.com/yourusername/razor-xmd-lite.git
cd razor-xmd-lite
npm install
```

*🟢 Launch the Bot*

```bash
node index.js
```

- Enter your phone number when prompted
- Scan the pairing code via WhatsApp → Linked Devices → Enter Code
- Your number will be added as an owner automatically

---

*🧠 Architecture*

- 🧩 *Modular Commands* – Each command lives in `/commands`
- 🔐 *Role Enforcement* – Owner/admin/group logic via `/utils/roles.js`
- 💾 *Persistent Config* – Settings stored in `config.json`
- 📢 *Newsletter Branding* – Messages styled as forwarded from
  [WhatsApp Newsletter](https://whatsapp.com/channel/0029VbB5sclIHphQM2cOFE2P)

---

*📁 File Structure*

```
razor-xmd-lite/
├── commands/
│   ├── play.js
│   ├── song.js
│   ├── video.js
│   ├── img.js
│   └──...
├── utils/
│   ├── config.js
│   ├── roles.js
│   ├── context.js
├── assets/
│   └── menu.jpg
├── config.json
├── index.js
```

---

*👑 Credits*

- Built with [Baileys MD](https://github.com/WhiskeySockets/Baileys)
- Inspired by Razor XMD and Malvin Tech 🪀
- Newsletter Channel:
  [Whatsapp Channel](https://whatsapp.com/channel/0029VbB5sclIHphQM2cOFE2P)

---

*💬 Support & Contributions*

Feel free to fork, star, and contribute!
For issues or feature requests, open a GitHub issue or reach out via the WhatsApp channel.