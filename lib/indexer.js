/**
 * Flattens tree into a list for search/indexing
 */
function flattenTree(tree) {
  const result = [];

  function walk(nodes) {
    for (const node of nodes) {
      result.push({
        name: node.name,
        path: node.path,
        type: node.type,
      });

      if (node.children) {
        walk(node.children);
      }
    }
  }

  walk(tree);
  return result;
}

module.exports = { flattenTree };