HapiCycle
===

HapiCycle is a basic starter kit to get you going with a straight-forward isomorphic/universal Cycle.js app.

**WORK IN PROGRESS**

*HapiCycle is currently a WIP and the skeleton app may not yet be following ideal FRP/Cycle conventions/best-practices and the Webpack config hasn't been fully optimized. Pull requests are welcome!*

Features / Libraries included
---

 * **[Cycle.js](http://cycle.js.org/)**
 * **[Hapi](http://hapijs.com/)** API/server configured to render your Cycle.js app on the server-side
 * **[Waterline ORM](https://github.com/balderdashy/waterline)** via **[Dogwater](https://github.com/devinivy/dogwater)**, preconfigured with Memory adapter
 * A skeleton Cycle app under `./src/ui/` providing basic user CRUD functionality as an example/starting point for your app. Includes a bunch of helpful components such as:
   * `./src/ui/components/alerts` – Alerts that automatically dismiss after an elapsed time
   * `./src/ui/components/label-input` – Inputs with label elements that behave like the HTML5 `placeholder` attribute, but with animations and better accessibility
   * `./src/ui/components/layout` – A layout wrapper component that wraps your pages with a common layout VTree
 * **[Webpack](http://webpack.github.io/)** preconfigured with:
   * **[HMR](https://webpack.github.io/docs/hot-module-replacement.html)**
   * [less-loader](https://www.npmjs.com/package/less-loader) to automatically transpile any LESS your components `import`
   * [css-loader](https://www.npmjs.com/package/css-loader) with **[CSS Modules](https://github.com/css-modules/css-modules)** enabled
   * [babel-loader](https://www.npmjs.com/package/babel-loader) with `babel-preset-es2015` for **[ES2015](https://babeljs.io/docs/learn-es2015/)** support and `babel-polyfill` for old browser support
 * [Bootstrap](http://getbootstrap.com/)'s LESS source is included by default, if you don't want it just run: `rm -rf ./assets/styles/bs/`
 * [Animate.css](https://daneden.github.io/animate.css/) for easy transitions
 * [FontAwesome](http://fontawesome.io/) for easy to use vector icons

Getting Started
---

  1. `$ git clone https://github.com/wyqydsyq/hapi-cycle.git hapi-cycle/ && cd hapi-cycle/`
  2. `$ npm install`
  3. `$ npm run launch`
  4. Open `http://localhost:1337/` in your browser.

TODO
---
 1. Optimize Webpack config – currently all assets are bundled in both server and client configs. We need one of these configs to bundle the assets and the other one to alias/refer to the already-bundled assets instead of rebundling them.
 2. Follow FRP/Cycle best practices – some components need refactoring to be more efficient and readable. A few files are `import`ing modules that don't get used.
 3. Improve configurability – Make some basic `development`/`production` environment-specific configurations. HMR shouldn't be registered in `server.js` and shouldn't be injected into the `client.js` bundle in `production`.
 4. Set up API scaffold/boilerplate - API routes/handlers are currently just defined in `./src/server.js`, ideally they should be set up as a seperate file for each handler with a single `routes.js` mapping route `path`s to `handler`s.
 5. Make a Yeoman generator – Porting this into a Yeoman generator would broaden the awareness/appeal and make using this a bit easier for those who already use Yeoman for scaffolding apps.
