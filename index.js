const { Client, WebhookClient, Collection } = require("discord.js-selfbot-v13");
const config = require("./config.js"); // Assuming config.js holds bot token and channel ID

// Error Handling and Logging
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES"], // Request necessary intents
  checkUpdate: false, // Disable unnecessary update checks
});

const logChannelId = config.logChannel || process.env.LOG_CHANNEL_ID; // Optional logging channel ID
const logger = logChannelId
  ? new WebhookClient(logChannelId) // Create webhook client for logging
  : console; // Default to console logging

function log(message, type = "info") {
  logger.send(`${type.toUpperCase()}: ${message}`).catch((error) => console.error(error));
}

// Helper Functions
client.help = new (require("./function"))(); // Instantiate helper functions

async function sendCommand(cmd) {
  try {
    const message = await client.channels.cache.get(config.channel)?.send(cmd);
    log(`Sent command: ${cmd}`, "success");
    await client.help.save("cmds", 1, true); // Update counter (if applicable)
    await client.help.wait(2); // Wait for a short interval
  } catch (error) {
    log(`Failed to send command "${cmd}": ${error.message}`, "error");
    client.help.warn("Failed to send message to channel");
  }
}

// Event Handlers
client.on("ready", async () => {
  log(`${client.user.tag} is ready!`, "success");
  await client.help.setup();

  client.channel = client.channels.cache.get(config.channel); // Fetch channel object
  if (!client.channel) {
    return client.help.warn("Invalid channel ID in config.js.");
  }

  log(">>> Starting auto bot...", "info");
  await setup();
});

client.on("messageCreate", require("./events/create")); // Handle message creation
client.on("messageUpdate", require("./events/update")); // Handle message updates

// Main Loop (Improved Logic and Error Handling)
async function setup() {
  if (!client.channel) return log(">>> No channel found.", "error");

  let isRunning = true; // Flag to control loop

  while (isRunning) {
    try {
      if (!client.help.isOkay) continue; // Respect user request to stop

      await sendCommand("owo hunt");
      await sendCommand("owo battle");
      await sendCommand("owo sell all");
      await sendCommand("owo inv");

      // Daily command with rate limiting
      if (Date.now() - client.help.oldDb.daily > 1000 * 60 * 60 * 24) {
        await sendCommand("owo daily");
        await client.help.save("daily", Date.now());
      }

      // CF command with check for sufficient funds
      if (config.cf.enable && config.cf.amount < client.help.oldDb.cash) {
        await sendCommand(`owo cf ${config.cf.amount}`);
        await client.help.save("cash", client.help.oldDb.cash - config.cf.amount);
      }

      await client.help.wait(40); // Wait for a short interval
    } catch (error) {
      log(`Error in main loop: ${error.message}`, "error");
    }
  }

  log("Bot stopped.", "info");
}

// Login
client.login(config.token).catch((error) => {
  log(`Login failed: ${error.message}`, "error");
});

