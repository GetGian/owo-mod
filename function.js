const fs = require("fs/promises"); // Import necessary functions
const config = require("./config.js"); // Assuming config.js holds data path

class Help {
  constructor() {
    this.isOkay = true; // Flag to indicate if bot should continue
  }

  async setup() {
    try {
      this.oldDb = await this.getDB(); // Read existing data
      this.currentDb = this.getConfig(); // Set default data
      console.log(">>> DB Loaded".green);
    } catch (error) {
      console.error("Error loading DB:", error);
    }
  }

  wait(seconds) {
    const time = this.getRand(seconds, seconds + 5); // Randomized wait time
    return new Promise((resolve) => setTimeout(resolve, time * 1000));
  }

  log(msg) {
    const timestamp = new Date().toLocaleString(); // Formatted timestamp
    console.log(`>>> [${timestamp}] : ${msg}.`.yellow);
  }

  warn(msg) {
    const timestamp = new Date().toLocaleString(); // Formatted timestamp
    console.error(`>>> [${timestamp}] WARNING: ${msg}.`.red);
  }

  // Improved getZoo function (needs more context without game specifics)
  async getZoo(str) {
    // Implement logic to extract zoo information from the provided string (str)
    // Based on the provided snippet, this logic might need further adjustment.
    return []; // Placeholder for extracted zoo information
  }

  async save(key, value, add = false) {
    if (key === "cash") {
      this.oldDb.cash = this.oldDb.cash || 0; // Initialize cash if not present
      this.currentDb.cash = this.currentDb.cash || 0;
    }

    if (add) {
      this.oldDb[key] += value;
      this.currentDb[key] += value;
    } else {
      this.oldDb[key] = value;
      this.currentDb[key] = value;
    }

    await this.write(); // Write updated data
  }

  async write(db) {
    try {
      await fs.writeFile(config.data, JSON.stringify(db ?? this.oldDb)); // Write data
    } catch (error) {
      console.error("Error writing DB:", error);
    }
  }

  async getDB() {
    try {
      const data = await fs.readFile(config.data); // Read data
      return data ? JSON.parse(data.toString()) : this.getConfig(); // Parse or set defaults
    } catch (error) {
      console.error("Error reading DB:", error);
      return this.getConfig(); // Return default data on error
    }
  }

  extractEmoji(str) {
    // Implement logic to extract emoji information from the provided string (str)
    // This functionality might not be relevant for your specific use case.
    return []; // Placeholder for extracted emoji information
  }

  listByRank(list) {
    // Implement logic to rank and organize items based on the provided list (list)
    // This functionality might not be relevant for your specific use case.
    return {
      items: [],
      list: [],
    }; // Placeholder for ranked and organized items
  }

  getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getConfig() {
    return {
      cmds: 0,
      cash: 0,
      zoo: {},
      gem: [],
      daily: 0,
    }; // Default data for the helper functions
  }
}

module.exports = Help;
