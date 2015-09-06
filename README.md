# garnish

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![img](http://i.imgur.com/8OP1YPB.png)

Prettifies [ndjson](http://ndjson.org/) or [bole](https://github.com/rvagg/bole) logs from [budo](https://github.com/mattdesl/budo), [wzrd](https://github.com/maxogden/wzrd/), [wtch](https://github.com/mattdesl/wtch) and other tools. Similar to [bistre](https://github.com/hughsk/bistre).

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

## CLI

```sh
wzrd index.js | garnish [opts]

Options:
    
    --level, -l    the minimum debug level, default 'info'
    --verbose, -v  print all log levels
```

Where `level` can be `debug`, `info`, `warn`, `error`.

If `--verbose` is specified, `--level` will be ignored.

## API

#### `garnish(opt)`

Returns a duplexer that parses input as ndjson, and writes a pretty-printed result. Options:

- `level` the minimum level to listen for, defaults to `"info"`

## format
PRs and suggestions welcome for other tools (Webpack? Watchify? Beefy? etc).
Currently handles [bole](https://github.com/rvagg/bole) logs with some added
flair for the following:
- __level__: the loglevel e.g. `debug`, `info`, `error` (default `info`)
- __name__: an optional event or application name. It's recommended to always have a name.
- __message__: an event message.
- __url__: a url (stripped to pathname), useful for router logging.
- __statusCode__: an HTTP statusCode. Codes `>=400` are displayed in red.
- __contentLength__: the response size.
- __elapsed__: time elapsed since the previous related event.
- __type__: the type of event logged.

__example__
```js
//simple event
{ type: 'generated', url: '/' }

//timed event with type
{ type: 'foo', url: '/blah.js', elapsed: '325ms' }
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/garnish/blob/master/LICENSE.md) for details.
