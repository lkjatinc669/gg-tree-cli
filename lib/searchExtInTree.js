/**
 * Filters a tree by file extensions while preserving structure
 *
 * @param {Array} nodes - tree nodes
 * @param {Array<string>} extensions - [".js", ".ts"] (must include dot)
 */
function searchExtInTree(nodes, extensions) {
  if (!Array.isArray(extensions) || extensions.length === 0) {
    return nodes;
  }

  const extSet = new Set(
    extensions.map(ext => ext.toLowerCase())
  );

  function walk(nodes) {
    const result = [];

    for (const node of nodes) {
      if (!node) continue;

      // Directory
      if (node.type === "dir") {
        const children = walk(node.children || []);

        if (children.length > 0) {
          result.push({
            ...node,
            children,
          });
        }
      }

      // File
      else if (node.type === "file") {
        const ext = getExtension(node.name);

        if (extSet.has(ext)) {
          result.push(node);
        }
      }
    }

    return result;
  }

  return walk(nodes);
}

/**
 * Extract file extension safely
 */
function getExtension(filename) {
  const idx = filename.lastIndexOf(".");
  if (idx === -1) return "";
  return filename.slice(idx).toLowerCase();
}

module.exports = { searchExtInTree };