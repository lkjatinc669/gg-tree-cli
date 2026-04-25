/**
 * Filters a tree while preserving structure
 *
 * - Keeps files that match predicate
 * - Keeps directories only if they contain matching children
 */
function searchFileInTree(nodes, predicate) {
  const result = [];

  for (const node of nodes) {
    if (!node) continue;

    // Directory
    if (node.type === "dir") {
      const children = searchFileInTree(node.children || [], predicate);

      if (children.length > 0) {
        result.push({
          ...node,
          children,
        });
      }
    }

    // File
    else {
      if (predicate(node)) {
        result.push(node);
      }
    }
  }

  return result;
}

module.exports = { searchFileInTree };