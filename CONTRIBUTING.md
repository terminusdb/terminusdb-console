
# Contributing

This is the TerminusDB Console, TerminusDB Server references this
from the index page served when you access the Console from the
built in webserver, on http://127.0.0.1:6363/console by default.

The URL TerminusDB Server expects the Console code to be available at is set by
way of the environment variable `TERMINUSDB_CONSOLE_BASE_URL`

By default this would be `https://unpgk.com/@terminusdb/terminusdb-console`

If you are working on TermminusDB Server and want to have a development version
of the console available, just set this environment variable.

It you are running TerminusDB via [TerminusDB Quickstart], then you can set this in your
`ENV` file, see [`ENV.example`].

[TerminusDB Quickstart]: https://github.com/terminusdb/terminusdb-quickstart
[`ENV.example`]: https://github.com/terminusdb/terminusdb-quickstart/blob/master/ENV.example

## Working with a local version of console

Clone this repo and do `npm install` and `npm run serve`

```
npm install
npm run serve
```

Now the console should be running on `http://127.0.0.1:3005`

`TERMINUSDB_CONSOLE_BASE_URL` can be set to that, and TerminusDB Server will load from here.

```
TERMINUSDB_CONSOLE_BASE_URL=http://127.0.0.1:3005
```

## Working with local versions of dependencies

If you also want to have local versions of the dependencies of
console, such as `@terminusdb/terminusdb-client`, then you should
clone those repos locally and use `npm link` to make npm use the
local version.

**Do not edit `package.json` or the webpack config with file paths** Use `npm
link` if you want to use local packages, or set `.npmrc` if you want to use our
dev packages.

### Rebuild Dependencies

Keep in mind that when you make changes in the dependencies, you
will need to do an `npm build` in the one ones that have changed to
see those changes in console.
