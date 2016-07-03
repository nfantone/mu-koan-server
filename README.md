# mu-kōän-server 公案-閉鎖
[![Build Status](https://travis-ci.org/nfantone/mu-koan-server.svg?branch=master)](https://travis-ci.org/nfantone/mu-koan-server)

> Graceful shutdown decorator for node's http(s) server

```sh
npm i --save mu-koan-server
```

[![js-semistandard-style](https://cdn.rawgit.com/flet/semistandard/master/badge.svg)](https://github.com/Flet/semistandard)

## Usage
Wrap an instance of a server implementation (such as node's `http` or `https`) with a [custom shutdown function][1] that enables graceful termination of pending requests before killing the process by calling the `createServer` exported function.

```javascript
'use strict';
/**
 * Configures a Koa app and exports 
 * a decorated node `https` server.
 */
const Koa = require('koa');
const server = require('mu-koan-server');

// Create Koa app instance
let app = new Koa();

// Create https server and export it
module.exports = server.createServer(app, {
  // Time (ms) before forced shutdown.
  // Default: 5000
  timeout: 2000,
  // Server implementation to use.
  // Default: `http`
  provider: require('https')
});

```

The returned server uses `app.callback()` as [its request listener][2].


---

## License
MIT

[1]: [https://npmjs.org/http-shutdown]
[2]: [https://nodejs.org/api/http.html#http_http_createserver_requestlistener]
