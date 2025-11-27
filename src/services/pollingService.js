/**
 * Polling Service for Real-time Updates
 * This service provides functionality to poll the backend for updates
 * without requiring WebSocket connections
 */

class PollingService {
  constructor() {
    this.intervals = new Map();
  }

  /**
   * Start polling for updates
   * @param {string} key - Unique identifier for this polling instance
   * @param {Function} callback - Function to call on each poll
   * @param {number} interval - Polling interval in milliseconds (default: 5000ms = 5 seconds)
   */
  startPolling(key, callback, interval = 5000) {
    // Clear existing interval if any
    this.stopPolling(key);

    // Start new interval
    const intervalId = setInterval(callback, interval);
    this.intervals.set(key, intervalId);

    console.log(`Polling started for ${key} with interval ${interval}ms`);
  }

  /**
   * Stop polling for a specific key
   * @param {string} key - Unique identifier for the polling instance to stop
   */
  stopPolling(key) {
    const intervalId = this.intervals.get(key);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(key);
      console.log(`Polling stopped for ${key}`);
    }
  }

  /**
   * Stop all polling instances
   */
  stopAllPolling() {
    this.intervals.forEach((intervalId, key) => {
      clearInterval(intervalId);
      console.log(`Polling stopped for ${key}`);
    });
    this.intervals.clear();
  }

  /**
   * Check if polling is active for a specific key
   * @param {string} key - Unique identifier to check
   * @returns {boolean}
   */
  isPolling(key) {
    return this.intervals.has(key);
  }
}

// Export singleton instance
export default new PollingService();
