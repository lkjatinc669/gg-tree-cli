const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

/**
 * Load ignore rules from files + CLI
 */
function createIgnoreFilter(rootDir, options) {
  const ig = ignore();

  // 🚫 disable all ignore
  if (options.noIgnore) {
    return () => false;
  }

  // 🔹 load .ggtreeignore
  const ggtreeIgnorePath = path.join(rootDir, ".ggtreeignore");
  if (fs.existsSync(ggtreeIgnorePath)) {
    ig.add(fs.readFileSync(ggtreeIgnorePath, "utf-8"));
  }

  // 🔹 load .gitignore
  const gitIgnorePath = path.join(rootDir, ".gitignore");
  if (fs.existsSync(gitIgnorePath)) {
    ig.add(fs.readFileSync(gitIgnorePath, "utf-8"));
  }

  // 🔹 CLI ignore
  if (options.ignore) {
    const cliPatterns = options.ignore
      .split(",")
      .map((i) => i.trim());
    ig.add(cliPatterns);
  }

  return (filePath) => ig.ignores(filePath);
}

module.exports = { createIgnoreFilter };