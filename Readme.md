# gg-tree-cli

A fast, cross-platform **tree + file indexing CLI** built with Node.js.

Designed to handle large directories safely with:
- infinite depth scanning
- ignore file support (`.ggtreeignore`, `.gitignore`)
- live progress display
- JSON and file output


## Installation

```bash
npm install -g gg-tree-cli
````

---

## Usage

```bash
ggtree [directory] [options]
```

### Examples

```bash
# scan current directory
ggtree

# scan specific directory
ggtree ./src
ggtree D:

# limit depth
ggtree . --depth 2

# search files
ggtree --search auth

# output to file
ggtree . --output tree.txt

# JSON output
ggtree . --json

# ignore files/folders
ggtree . --ignore=node_modules,dist,*.log

# disable all ignore rules
ggtree . --no-ignore
```

---

## Options

| Option                | Description                               |
| --------------------- | ----------------------------------------- |
| `--depth <n>`         | Limit directory depth (default: infinite) |
| `--all`               | Show hidden files                         |
| `--ext <list>`        | Filter by extensions (`js,ts`)            |
| `--ignore <patterns>` | Ignore files/folders (comma-separated)    |
| `--no-ignore`         | Disable all ignore rules                  |
| `--json`              | Output as JSON                            |
| `--output <file>`     | Save output to file                       |
| `--search <query>`    | Search files by name                      |
| `--concurrency <n>`   | Control parallel scanning                 |

---

## Ignore System

gg-tree-cli supports:

### 1. `.ggtreeignore`

Custom ignore file in your project root:

```
node_modules
dist
*.log
```

---

### 2. `.gitignore`

Automatically respects existing `.gitignore`

---

### 3. CLI ignore

```bash
ggtree . --ignore=dist,*.log
```

---

### 4. Disable ignore

```bash
ggtree . --no-ignore
```

---

## Output

### Tree Output

```
my-project/
├── src
│   ├── index.js
│   └── utils.js
└── package.json
```

---

### JSON Output

```bash
ggtree . --json
```

---

### Save to file

```bash
ggtree . --output tree.txt
```

---

## Features

* Cross-platform (Windows, macOS, Linux)
* Safe recursive scanning (no crashes on large drives)
* Infinite depth support
* Ignore system (`.ggtreeignore` + `.gitignore`)
* Live progress indicator
* Modular architecture (usable as a library)

---

## Project Structure

```
bin/
  cli.js          # CLI entry (Commander)

lib/
  scanner.js      # recursive traversal
  limiter.js      # concurrency control
  printer.js      # tree output
  indexer.js      # flatten structure
  search.js       # search logic
  ignore.js       # ignore handling
```

---

## Performance Tips

* Use `--depth` for faster scans on large drives
* Reduce concurrency for stability:

  ```bash
  ggtree D: --concurrency 10
  ```

---

## License
MIT