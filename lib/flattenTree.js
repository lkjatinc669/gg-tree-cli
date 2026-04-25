/**
 * Flattens a hierarchical tree into a flat array
 *
 * Useful for:
 * - searching
 * - indexing
 * - filtering
 *
 * @param {Array} tree - tree structure (output of scanner)
 *   Each node: { name, path, type, children? }
 *
 * @returns {Array} flat list of nodes
 *   Each item: { name, path, type }
 */
function flattenTree(tree) {
  const result = [];

  /**
   * Recursive traversal (depth-first)
   * Walks through all nodes and collects them into result array
   */
  function walk(nodes) {
    for (const node of nodes) {
      // Add current node to flat list
      result.push({
        name: node.name,
        path: node.path,
        type: node.type,
      });

      // If directory has children, recurse into it
      if (node.children && node.children.length > 0) {
        walk(node.children);
      }
    }
  }

  // Start traversal from root
  walk(tree);

  return result;
}

module.exports = { flattenTree };