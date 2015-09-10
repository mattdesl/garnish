# garnish

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

![screen](http://i.imgur.com/a6lMvDY.png)

Prettifies [ndjson](http://ndjson.org/) or [bole](https://github.com/rvagg/bole) logs from [budo](https://github.com/mattdesl/budo), [wzrd](https://github.com/maxogden/wzrd/) and other tools. Similar to [bistre](https://github.com/hughsk/bistre).

Install: 

```sh
npm install budo garnish --save-dev
```

Then in npm scripts:

```json
  "scripts": {
    "start": "budo index.js | garnish"
  }
```

Then `npm start` on your project to see it in action. 

## Usage

### CLI

Pipe a ndjson emitter into `garnish` like so:

```sh
node app.js | garnish [opts]

Options:
    
    --level, -l    the minimum debug level, default 'info'
    --verbose, -v  print all log levels
```

Where `level` can be `debug`, `info`, `warn`, `error`.

If `--verbose` is specified, `--level` will be ignored.

### API

#### `garnish([opt])`

Returns a duplexer that parses input as ndjson, and writes a pretty-printed result. Options:

- `level` (String)
  - the minimum log level to print (default `'info'`)
  - the order is as follows: `debug`, `info`, `warn`, `error`
- `verbose` (Boolean)
  - if true, `opt.level` is ignored and all messages will be printed (default `false`)


## format

Typically, you would use [bole](https://github.com/rvagg/bole) or [ndjson](https://www.npmjs.com/package/ndjson) to write the content to garnish. You can also write ndjson to `stdout` like so:

```js
console.log({
  name: 'myApp',
  level: 'warn',
  message: 'not found',
  statusCode: 404,
  url: '/foo.txt'
})
```

Currently garnish styles the following:

- `level` - the log level e.g. `debug`, `info`, `warn`, `error` (default `info`)
- `name` - an optional event or application name. It's recommended to always have a name.
- `message` - an event message.
- `url` - a url (stripped to pathname), useful for router logging.
- `statusCode` - an HTTP statusCode. Codes `>=400` are displayed in red.
- `contentLength` - the response size.
- `elapsed` - time elapsed since the previous related event.
- `type` - the type of event logged.
- `colors` - an optional color mapping for custom styles

For example:

```js
//simple event
{ type: 'generated', url: '/' }

//timed event with type and name
{ type: 'foo', url: '/blah.js', elapsed: '325ms', name: 'http' }
```

You can use the `colors` field to override any of the default colors with a new [ANSI style](https://github.com/chalk/ansi-styles). 

For example, the following will print `elapsed` in yellow if it passes our threshold:

```js
function logTime (msg) {
  var now = Date.now()
  var time = now - lastTime
  lastTime = now
    
  console.log({
    name: 'app',
    message: msg,
    elapsed: time + ' ms',
    colors: {
      elapsed: time > 1000 ? 'yellow' : 'green'
    }
  })
}
  
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/garnish/blob/master/LICENSE.md) for details.
