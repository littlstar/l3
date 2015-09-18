l3
=====
Dead simple local cdn.

## about

`l3` is an easy to use local cdn for when your on the move and just
can't stand bad internet. l3 wants to help ease your development pain by
keeping files you'd access on the web local on your filesystem.
l3 maintains a directory structure for you and allows you to sync files
with no effort. l3 will help you maintain the lifetime of these files by
providing easy mechanisms for expiration and purging.

## installation

`l3` can be installed with `npm`.

```sh
$ npm install -g l3
```

## usage

Out of the box `l3` ships with the following comands:

* `init` - Outputs useful information for sourcing in your `.bashrc` or `.bash_profile`.
* `setup` - Sets up the l3 environment on your filesystem.
* `sync` - Syncs a file into a bucket namespace
* `index` - Opens up the l3 index file with your editor (`$EDITOR`).
* `update` - Updates files in a bucket configurable with bucket and file patterns.
* `server` - Starts a l3 web server.
* `purge` - Purge entire store or by bucket.
* `which` - Returns an absolute file path to a named file

## example

Sync file:

```sh
$ l3 sync -b images/giphy https://media.giphy.com/media/xISLHoUElBz5m/giphy.gif
```

List file:

```sh
$ l3 ls
images/giphy/giphy.gif
```

Open the file

```sh
$ open $(l3 which images/giphy/giphy.gif)
```

Serve files:

```sh
$ l3 server -p 3000
serving `/Users/jwerle/.l3'
listening on port 3000
```

Open the file in the browser:

```sh
$ open http://localhost:3000/images/giphy/giphy.gif
```

## license

MIT
