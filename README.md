HapiCycle
===

**WORK IN PROGRESS**

HapiCycle is a basic starter kit to get you going with a straight-forward isomorphic/universal Cycle.js app.

Features / Libraries included
---

 * Cycle.JS
 * Hapi API/server configured to render your Cycle.js app on the server-side
 * Webpack preconfigured with:
   * HMR
   * less-loader to automatically transpile any LESS your components `import`
   * css-loader with CSS Modules enabled
   * babel-loader for ES2015/ES2016 support
 * Waterline ORM via Dogwater
 * Bootstrap LESS source is included by default, if you don't want it just run: `rm -rf ./assets/styles/bs/`
 * Animate.css for easy transitions

Getting Started
---

  1. `$ git clone https://github.com/wyqydsyq/HapiCycle.git HapiCycle/ && cd HapiCycle/`
  2. `$ npm install`
  3. `$ npm run launch`
  4. Open `http://localhost:1337/` in your browser.
