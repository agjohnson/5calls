# 5calls

5calls is split into two pieces

* Site front end, written in Javascript, using Choo
* Application server back end, for data processing, written in Go

To make display changes, you likely won't need to handle the application
server, and can instead rely on the production version of 5calls, running at
5calls.org -- more on this below.

## Development

### Front End

Front end requirements must first be installed with:
`npm install`

Gulp is used to compile front end static assets. If you do not have Gulp
installed globally, you can install this with:
`npm install -g gulp`

Gulp is configured, by default, to watch and recompile front end files when
any changes are detected. You can run Gulp in this mode with:
`gulp`

This default command will also spin up an HTTP server for serving the site
files on port `tcp/8000`.

The other main Gulp task is the `deploy` task, which does not watch for
changes, and applies addition transforms on the assets -- such as an uglify
transform on Javascript sources.

### Application Server

If you need to make any changes to the back end code, you'll need to set up
your environment for Go development -- see [How to Write Go
Code](https://golang.org/doc/code.html) for more information on this.

With your environment set up, you should first start by installing
dependencies. In the `go/` path, this will install these dependencies for you:
`make deps`

To run the application code:
`make run`

To build the application code to a binary file:
`make`

You will need to build the application to a binary in order to pass in
arguments, such as the Airtable database ID:
`./fivecalls --airtable-base=XXX`

#### Running Locally

There are several requirements to setting up the application server:

* A [Google Civic Information API][civic-api] key
* An [Airtable][airtable] API key
* An [Airtable][airtable] database
* [Airtable][airtable] database ID
* Locally override the application server in the front end code

To set up the Airtable database, first create a database in Airtable. You can
get the database ID from the API afterwards. This piece will be passed into
the `fivecalls` binary, using the `--airtable-base` command line argument.

TODO: Airtable schema

[airtable]: https://airtable.com
[civic-api]: https://developers.google.com/civic-information/

## Deployment

Use the makefile in the go folder. You can `make deploy` to update the go server or `make deploy_static` to update the site.

When updating the go server, remember to log in, connect to the screen instance (`screen -r`) and stop the go process before replacing it via the deploy, otherwise you get "text file busy" errors in scp.
