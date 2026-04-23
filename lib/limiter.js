/**
 * Creates a concurrency limiter for async operations
 *
 * Ensures that no more than `limit` async tasks run at the same time.
 * Useful for filesystem operations to avoid EMFILE (too many open files).
 *
 * @param {number} limit - maximum number of concurrent tasks
 *
 * @returns {function} limiter(fn)
 *   - accepts an async function
 *   - returns a promise that resolves when the task completes
 */
function createLimiter(limit) {
  let active = 0;
  const queue = [];

  /**
   * Executes next task in queue if capacity is available
   */
  const next = () => {
    // Stop if max concurrency reached or no pending tasks
    if (active >= limit || queue.length === 0) return;

    active++;

    // Take next task from queue
    const { fn, resolve, reject } = queue.shift();

    /**
     * Execute the task
     * - resolve/reject the original promise
     * - always decrement active count after completion
     */
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        active--;
        next();
      });
  };

  /**
   * Public limiter function
   *
   * Wraps async function execution:
   * - queues task
   * - returns promise
   * - ensures controlled concurrency
   */
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

module.exports = { createLimiter };