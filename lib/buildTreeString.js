/**
 * Builds a tree structure string from nodes
 *
 * Uses ASCII connectors to represent hierarchy:
 * ├── for intermediate nodes
 * └── for last node in a level
 *
 * @param {Array} nodes - list of file/directory nodes
 * @param {string} prefix - indentation prefix for current level
 *
 * @returns {string} formatted tree structure
 */
function buildTreeString(nodes, prefix = "") {
  let output = "";

  nodes.forEach((node, index) => {
    // Determine if current node is the last child
    const isLast = index === nodes.length - 1;

    // Choose connector based on position
    const connector = isLast ? "└── " : "├── ";

    // Append current node line
    output += prefix + connector + node.name + "\n";

    /**
     * If node is a directory, recursively process children
     * Prefix rules:
     * - last node → add spaces ("    ")
     * - not last → add vertical pipe ("│   ")
     */
    if (node.type === "dir" && node.children) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      output += buildTreeString(node.children, newPrefix);
    }
  });

  return output;
}

module.exports = { buildTreeString };