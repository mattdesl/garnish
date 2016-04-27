# garnish [![stability: stable][stable-badge]][stable-link]

Prettifies [ndjson][ndjson] or [bole][bole] logs from [budo][budo],
[wzrd][wzrd] and other tools.

Example with [budo][budo], which uses this package under the hood:
<img src="http://i.imgur.com/Pvus8vy.png" width="75%" />

## Install
```sh
$ npm install garnish [-g|--save-dev]
```

## Usage
### CLI
Pipe a ndjson emitter into `garnish` like so:
```sh
$ node app.js | garnish [opts]
```

### API
#### `garnish()`
Returns a parser that takes ndjson and outputs pretty lines.

## format
Typically, you would use [bole][bole] or
[ndjson][ndjson] to write the content to garnish.
You can also write ndjson to `stdout` like so:

```js
// a log message
console.log({
  name: 'myApp',
  level: 'warn',
  message: 'not found'
})

// a typical server message
console.log({
  name: 'myApp',
  type: 'generated',
  level: 'info',
  url: '/foo.png',
  statusCode: 200,
  contentLength: 12800, // in bytes
  elapsed: 120 // in milliseconds
})
```

Currently garnish styles the following:
- __level:__ the log level e.g. `debug`, `info`, `warn`, `error` (default
  `debug`) - only shown if `message` is present
- __name:__ an optional event or application name. It's recommended to always
  have a name.
- __message:__ an event message.
- __url:__ a url (stripped to pathname), useful for router logging.
- __statusCode:__ an HTTP statusCode. Codes `>=400` are displayed in red.
- __contentLength:__ the response size; if a `number`, bytes are assumed
- __elapsed:__ time elapsed since the previous related event; if a `number`,
  milliseconds are assumed
- __type:__ the type of event logged

## See Also
- [budo][budo]
- [bole][bole]
- [ndjson][ndjson]
- [wzrd][wzrd]
- [bistre](https://github.com/hughsk/bistre)

## License
MIT, see
[LICENSE.md](http://github.com/mattdesl/garnish/blob/master/LICENSE.md) for
details.
[stable-badge]: https://img.shields.io/badge/stability-2%20stable-brightgreen.svg?style=flat-square
[stable-link]: https://nodejs.org/api/documentation.html#documentation_stability_index
[bole]: https://github.com/rvagg/bole
[ndjson]: https://www.npmjs.com/package/ndjson
[budo]: https://github.com/mattdesl/budo
[wzrd]: https://github.com/maxogden/wzrd/
