/**
 * Simple substring search (case-insensitive)
 */
function search(files, query) {
  const q = query.toLowerCase();

  return files.filter((file) =>
    file.name.toLowerCase().includes(q)
  );
}

module.exports = { search };