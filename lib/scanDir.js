const fs = require("fs/promises");
const path = require("path");

/**
 * Recursively scans a directory and builds a tree structure
 *
 * @param {string} dir - current directory to scan
 * @param {object} options - configuration object
 * @param {function} limiter - concurrency limiter (prevents overload)
 * @param {number} depth - current recursion depth
 * @param {function} onProgress - callback for progress updates
 *
 * @returns {Array} tree structure
 */
async function scanDir(dir, options, limiter, depth = 0, onProgress) {
  // Notify progress (used by CLI progress bar)
  if (onProgress) onProgress(dir);

  // Stop recursion if max depth exceeded
  if (depth > options.maxDepth) return [];

  let entries;
  try {
    // Read directory contents
    entries = await fs.readdir(dir);
    // Skip directories we cannot access (permissions, etc.)
  } catch {
    return [];
  }

  const results = [];

  for (const file of entries) {
    const fullPath = path.join(dir, file);

    /**
     * Convert absolute path → relative path
     * Required for ignore engine (.gitignore/.ggtreeignore)
     */
    const relativePath = path.relative(options.rootDir, fullPath);

    /**
     * Ignore filter check (fast exit)
     * Skips:
     * - .gitignore rules
     * - .ggtreeignore rules
     * - CLI ignore patterns
     */
    if (options.ignoreFilter && options.ignoreFilter(relativePath)) {
      continue;
    }

    let stats;
    try {
      // Use lstat to avoid following symlinks
      stats = await fs.lstat(fullPath);
    } catch {
      // Skip unreadable files
      continue;
    }

    // Prevent infinite loops / broken traversal via symlinks
    if (stats.isSymbolicLink()) continue;

    // Build node representation
    const isDir = stats.isDirectory();

    const node = {
      name: file,
      path: fullPath,
      type: isDir ? "dir" : "file",
    };

    /**
     * Recursively scan subdirectories
     */
    if (stats.isDirectory()) {
      node.children = await scanDir(
        fullPath,
        options,
        limiter,
        depth + 1,
        onProgress
      );
    }

    results.push(node);
  }

  return results;
}

module.exports = { scanDir };