# garnish

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/5A4b6hT.png)

Prettifies [ndjson](http://ndjson.org/) from wzrd and similar bundlers. 

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

If the message has `elapsed`, it will be printed in green next to a magenta `type` and bold `url`. Otherwise `type` will be dimmed and `url` boldened. Other messages are printed greyed out. 

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/garnish/blob/master/LICENSE.md) for details.
