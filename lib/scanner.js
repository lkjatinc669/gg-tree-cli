const fs = require("fs/promises");
const path = require("path");

/**
 * Check if file/folder should be ignored
 */
function shouldIgnore(file, fullPath, options) {
  if (!options.ignore || options.ignore.length === 0) return false;

  return options.ignore.some((pattern) => {
    // exact match (node_modules)
    if (file === pattern) return true;

    // wildcard (*.log)
    if (pattern.startsWith("*")) {
      return file.endsWith(pattern.slice(1));
    }

    // contains match (dist, build, etc.)
    return fullPath.includes(pattern);
  });
}

async function scanDir(dir, options, limiter, depth = 0, onProgress) {
  if (onProgress) onProgress(dir);

  if (depth > options.maxDepth) return [];

  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const results = [];

  for (const file of entries) {
    const fullPath = path.join(dir, file);

    // 🔥 ADD THIS BLOCK RIGHT HERE
    const relativePath = path.relative(options.rootDir, fullPath);

    if (options.ignoreFilter && options.ignoreFilter(relativePath)) {
      continue; // skip ignored file/folder early
    }

    let stats;
    try {
      stats = await fs.lstat(fullPath);
    } catch {
      continue;
    }

    if (stats.isSymbolicLink()) continue;

    const node = {
      name: file,
      path: fullPath,
      type: stats.isDirectory() ? "dir" : "file",
    };

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