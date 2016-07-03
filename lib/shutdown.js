'use strict';

/**
 * Simple module that allows closing or
 * freeing resources before server shutdown
 * upon receiving system signals like 'SIGTERM'
 * or 'SIGINT'.
 *
 * @module lib/shutdown
 */
const defaults = require('lodash.defaults');
const httpShutdown = require('http-shutdown');
const logger = require('mu-koan-logger');

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'];
const DEFAULT_OPTIONS = {
  provider: require('http'),
  timeout: 5000
};

// Module API
module.exports = {
  createServer
};

function createServer(app, options) {
  options = defaults({}, options, DEFAULT_OPTIONS);
  let log = logger.get(options);
  let server = options.provider.createServer(app.callback());

  function shutdown(signal) {
    log.warn('Closing down server (%s received)', signal);

    // Regular shutdown
    server.shutdown((err) => {
      if (err) {
        log.error('Server failed to shutdown: %s', err);
      } else {
        log.info('✘ Server shut down successfully');
      }
      return process.exit(1);
    });

    // Force shutdown after timeout
    setTimeout(() => {
      log.warn('Could not close connections gracefully after %sms: forcing shutdown', options.timeout);
      return process.exit(1);
    }, options.timeout).unref();
  }

  // Listen for TERM (e.g. kill) and INT (e.g. Ctrl+C) signals
  // and shutdown gracefully.
  SHUTDOWN_SIGNALS.forEach((sig) => {
    process.once(sig, () => shutdown(sig));
  });

  return httpShutdown(server);
}
