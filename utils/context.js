const getContextInfo = (sender, config) => ({
  mentionedJid: [sender],
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: config.NEWSLETTER_JID || '120363402507750390@newsletter',
    newsletterName: config.botName || 'Sparks Tech 🪀',
    serverMessageId: 143
}
});

