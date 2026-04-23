/**
 * Build tree as string and return it
 */
function buildTreeString(nodes, prefix = "") {
  let output = "";

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? "└── " : "├── ";

    output += prefix + connector + node.name + "\n";

    if (node.type === "dir" && node.children) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      output += buildTreeString(node.children, newPrefix);
    }
  });

  return output;
}

module.exports = { buildTreeString };