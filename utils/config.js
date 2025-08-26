const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config.json');

module.exports = {
  getConfig: () => JSON.parse(fs.readFileSync(configPath)),
  updateConfig: (newConfig) => fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2))
};