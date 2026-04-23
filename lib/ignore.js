const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

/**
 * Creates an ignore filter function based on:
 * - .ggtreeignore (custom rules)
 * - .gitignore (standard rules)
 * - CLI-provided patterns
 *
 * @param {string} rootDir - root directory of scan
 * @param {object} options - CLI options
 *
 * @returns {function} filter function (filePath => boolean)
 *   → returns true if file should be ignored
 */
function createIgnoreFilter(rootDir, options) {
  // Initialize ignore engine (handles patterns like .gitignore)
  const ig = ignore();

  /**
   * Disable all ignore rules
   * When --no-ignore is used, return a function that never ignores anything
   */
  if (options.noIgnore) {
    return () => false;
  }

  /**
   * Load .ggtreeignore (custom ignore file)
   * Allows users to define project-specific rules
   */
  const ggtreeIgnorePath = path.join(rootDir, ".ggtreeignore");
  if (fs.existsSync(ggtreeIgnorePath)) {
    ig.add(fs.readFileSync(ggtreeIgnorePath, "utf-8"));
  }

  /**
   * Load .gitignore (industry standard ignore rules)
   * Ensures consistency with existing project setup
   */
  const gitIgnorePath = path.join(rootDir, ".gitignore");
  if (fs.existsSync(gitIgnorePath)) {
    ig.add(fs.readFileSync(gitIgnorePath, "utf-8"));
  }

  /**
   * CLI ignore patterns
   * Example:
   *   --ignore=node_modules,dist,*.log
   */
  if (options.ignore) {
    const cliPatterns = options.ignore
      .split(",")
      .map((i) => i.trim());
    ig.add(cliPatterns);
  }

  /**
   * Final filter function
   *
   * IMPORTANT:
   * - Expects relative paths (not absolute)
   * - Should be used inside scanner before processing files
   */
  return (filePath) => ig.ignores(filePath);
}

module.exports = { createIgnoreFilter };