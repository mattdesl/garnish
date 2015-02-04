# garnish

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Prettifies ndjson from wzrd and similar bundlers. 

Install: 

```sh
npm install wzrd garnish --save-dev
```

Then in npm scripts:

```json
  "scripts": {
    "start": "wzrd index.js | garnish"
  }
```

Then `npm start` on your project to see it in action. 

## Usage

[![NPM](https://nodei.co/npm/garnish.png)](https://www.npmjs.com/package/garnish)

#### `garnish()`

Returns a duplexer that parses input as ndjson, and writes a pretty-printed result. 

## format

PRs and suggestions welcome for other tools (Webpack? Watchify? Beefy? etc). Currently deals with the following:

```js
//simple event
{ type: 'generated', url: '/' }

//timed event with type
{ type: 'foo', url: '/blah.js', elapsed: '325ms' }
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/garnish/blob/master/LICENSE.md) for details.
