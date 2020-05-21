
# Contributing 

This is the TerminusDB console, TerminusDB server references this
from the index page served when you access the console from the
built in webserver, on http://localhost:6363/console by default.

The URL TerminusDB server expects the console code to be available at is set by
way of the environment variable `TERMINUSDB_CONSOLE_BASE_URL`

By default this would be `https://unpgk.com/@terminusdb/terminusdb-console`

You can also use a particular dev release, which are all built to bintray by
travis-ci. For example, the base url for console version 0.0.1 would be:

```
TERMINUSDB_CONSOLE_BASE_URL=https://dl.bintray.com/terminusdb/terminusdb/0.0.1
```

If you are working on TermminusDB Server and want to have a development version
of the console available, just set this environment variable.

It you are running TerminusDB via quickstart, then you can set this in your
`ENV` file, see `ENV.example`.

## Working with a local version of console

Most likely, if you are running console locally, it's because you are
a developer, and thus will be working with the `dev` branch of
console, so you probably want to want to point npm to our dev
repository by adding this line to your .npmrc

```
@terminusdb:registry=https://api.bintray.com/npm/terminusdb/npm-dev
```

Then clone this repo and do `npm install` and `npm run serve`

```
npm install
npm run server
```

Now the console should be running on `https://localhost:3005`

`TERMINUSDB_CONSOLE_BASE_URL` can be set to that, and TerminusDB Server will load from here.

```
TERMINUSDB_CONSOLE_BASE_URL=https://localhost:3005
```

## Working with local versions of dependencies

If you also want to have local versions of the dependencies of console, such as `@terminusdb/terminusdb-client`, then you should clone those repos locally and use `npm link` to make npm use the local version.

**Do not edit `package.json` or the webpack config with file paths** Use `npm link` if you want to use local packages, or set `.npmrc` if you want to use our dev packages.


