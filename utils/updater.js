const { exec } = require("child_process");

module.exports = {
    autoUpdate: () => {
        exec("git pull", (err, stdout) => {
            if (!err && stdout.includes("Updating")) {
                console.log("🔄 Repo updated. Restarting...");
                process.exit(0);
            }
        });
    }
};
