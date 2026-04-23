/**
 * Performs case-insensitive substring search on file list
 *
 * @param {Array} files - flattened list of file objects
 *   Expected shape: { name, path, type }
 *
 * @param {string} query - search term
 *
 * @returns {Array} filtered list of matching files
 */
function search(files, query) {
  // Normalize query for case-insensitive comparison
  const q = query.toLowerCase();

  return files.filter((file) =>
    // Ensure name exists and compare safely
    file.name.toLowerCase().includes(q)
  );
}

module.exports = { search };