#!/usr/bin/env node

// Core Node + dependencies
const path = require("path");
const { Command } = require("commander");
const fs = require("fs");

// Internal modules (tree engine)
const { scanDir } = require("../lib/scanner");
const { buildTreeString } = require("../lib/builder");
const { flattenTree } = require("../lib/indexer");
const { search } = require("../lib/search");
const { createLimiter } = require("../lib/limiter");
const { createIgnoreFilter } = require("../lib/ignore");

// Progress bar for live scanning feedback
const cliProgress = require("cli-progress");

// Importing meta data from package.json
const { description, version } = require("../package.json");

const program = new Command();

/**
 * CLI metadata
 * - name: command name used globally
 * - description: shown in --help
 * - version: CLI version
 */
program
  .name("ggtree")
  .description(description)
  .version(version);

/**
 * Main command (default behavior)
 * Handles:
 * - scanning directories
 * - filtering
 * - output modes (tree/json/search/file)
 */
program
  .argument("[dir]", "directory to scan", process.cwd())

  // CLI options
  .option("--all", "show hidden files")
  .option("--ext <extensions>", "filter extensions (comma separated)")
  .option("--depth <number>", "limit depth", parseInt)
  .option("--json", "output JSON")
  .option("--search <query>", "search files")
  .option("--ignore <patterns>", "ignore files/folders (comma separated)")
  .option("--concurrency <number>", "parallel scanning", parseInt, 20)
  .option("--no-ignore", "disable all ignore rules")
  .option("--output <file>", "save output to file")
  .action(async (dir, options) => {
    try {
      const targetDir = path.resolve(dir);

      console.log(options)
      /**
       * Build ignore filter:
       * - supports .ggtreeignore
       * - supports .gitignore
       * - supports CLI ignore
       * - can be disabled via --no-ignore
       */
      const ignoreFilter = createIgnoreFilter(targetDir, options);

      /**
       * Scanner configuration object
       */
      const config = {
        ignoreFilter,
        extensions: options.ext ? options.ext.split(",") : null,
        showHidden: options.all || false,
        maxDepth: options.depth ?? Infinity,
        rootDir: targetDir, 
      };

      // Concurrency limiter to avoid overwhelming filesystem
      const limiter = createLimiter(options.concurrency);

      /**
       * Progress bar setup (infinite animation style)
       * Since total files are unknown, we simulate movement
       */
      const progressBar = new cliProgress.SingleBar(
        {
          format: "Scanning |{bar}| {count} dirs | {dir}",
          hideCursor: true,
          barsize: 20,
        },
        cliProgress.Presets.shades_classic
      );

      let count = 0;
      let frame = 0;

      // fixed total for animation
      const TOTAL = 100;

      progressBar.start(TOTAL, 0, {
        dir: "Starting...",
        count: 0,
      });

      /**
       * Start scanning
       * onProgress callback updates progress bar in real-time
       */
      const tree = await scanDir(
        targetDir,
        config,
        limiter,
        0,
        (dir) => {
          count++;
          frame = (frame + 1) % TOTAL;

          progressBar.update(frame, {
            dir: dir.length > 40 ? "..." + dir.slice(-20) : dir,
            count,
          });
        }
      );

      progressBar.stop();

      // move to next line after scan completes
      if (process.stdout.isTTY) {
        process.stdout.write("\n");
      }

      /**
       * SEARCH MODE
       * Converts tree to flat list and filters by query
       */
      if (options.search) {
        const flat = flattenTree(tree);
        const results = search(flat, options.search);
        console.log(JSON.stringify(results, null, 2));
        return;
      }

      /**
       * JSON OUTPUT MODE
       */
      if (options.json) {
        console.log(JSON.stringify(tree, null, 2));
        return;
      }

      /**
       * TREE OUTPUT MODE
       * Builds formatted string
       */
      const rootName = path.basename(targetDir);
      const treeString = rootName + "/\n" + buildTreeString(tree);

      /**
       * FILE OUTPUT MODE
       */
      if (options.output) {
        fs.writeFileSync(options.output, treeString, "utf-8");
        console.log(`Saved to ${options.output}`);
      } else {
        console.log(treeString);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  }
  );

program.parse(process.argv);