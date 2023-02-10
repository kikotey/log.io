 DEBUGGER FOR REACT-NATIVE, EXPO TUNNEL, LOG VIEWER AND MORE
=================================================

New Usages:
 - file reader
 - simple Log Viewer
 - React-native Log Viewer
 - Expo tunnel Debugger
 - All applications that need the console debugger
 - and more

Inspired of the work of the [ NarrativeScience-old TEAM log.io](https://github.com/NarrativeScience-old/log.io)

## kikotey-debugger by kikotey.com - debug in Real-time log monitoring in your browser and console log

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache2.0)
[![Version](https://img.shields.io/badge/node-%3E%3D%2012-brightgreen)](https://nodejs.org/)
[![Node](https://img.shields.io/npm/v/log.io)](https://www.npmjs.com/package/log.io)

Powered by [node.js](http://nodejs.org) + [socket.io](http://socket.io)

## How does it work?

A **file output logs** watches log files for changes, sends new messages to the **server** via TCP, which broadcasts to **browsers** via socket.io.

## Terminology

**Stream loader** - It's the stream of logs consumed from a << source >> (file, blob for example) to a channel and exposed via a endpoint. The stream is a logical designation for a group of messages that relate to one another.  Examples include an application name, a topic name, or a backend service name.

**Listener server** - It's a consummer server connected to a channel stream.  All data consumed from the stream is exposed to the front screen or to the browser console.

**Source** - The path designation for a group of messages that originate from the same source. Examples include all logs of a server, a service provider name, or a filename.

**Debugger** - A (loader file stream, source) pair.

While originally designed to represent backend service logs spread across multiple servers, the stream/source abstraction is intentionally open-ended to allow users to define a system topology for their specific use case.

## Install & run

Install via npm

```
npm i -g @kikotey/kikotey-debugger-listener-server
npm i -g @kikotey/kikotey-debugger-stream-loader
npm i -g @kikotey/kikotey-debugger-cli
```

Configure hosts & ports (see example below)

```
vim ~/.kiko-cli/server.json
vim ~/.kiko-cli/config/file.json
```

Run server

```
debugger-listener-server
debugger-stream-loader

or with cli

debugger start
```

Browse to http://localhost:6688

## Install & run 

Begin sending log messages to the server via:


## With CLI

(After you create all configuration files. See step 1 and step 2 in the next section)

Run debugger
```
debugger start
```

Restart debugger
```
debugger restart
```

Stop debugger
```
debugger stop
```


## Without CLI

### STEP 1
```
kikotey-debugger-listener-server
```

Browse to http://localhost:6688

## Server configuration

There are two servers: the message server, which receives TCP messages from message inputs, and the HTTP server, which receives requests from browsers.  By default, the application looks for configuration in `~/.log.io/server.json`, and can be overridden with the environment variable `LOGIO_SERVER_CONFIG_PATH`.

Sample configuration file:

```json
{
  "messageServer": {
    "port": 6689,
    "host": "127.0.0.1"
  },
  "httpServer": {
    "port": 6688,
    "host": "127.0.0.1"
  },
  "debug": false,
  "basicAuth": {
    "realm": "abc123xyz",
    "users": {
      "username1": "password1"
    }
  }
}
```
`basicAuth` and `debug` are both optional keys that can be omitted.

## Server TCP interface

The file input connects to the server via TCP, and writes properly formatted strings to the socket.  Custom inputs can send messages to the server using the following commands, each of which ends with a null character:

Send a log message

```
+msg|streamName1|sourceName1|this is log message\0
```

Register a new input

```
+input|streamName1|sourceName1\0
```

Remove an existing input

```
-input|streamName1|sourceName1\0
```

### STEP 2 

```
kikotey-debugger-stream-loader
```

Browse to http://localhost:6689

## File path input configuration

Inputs are created by associating file paths with stream and source names in a configuration file.  By default, the file input looks for configuration in `~/.kiko-cli/config/file.json`, and can be overridden with the environment variable `LOGIO_FILE_INPUT_CONFIG_PATH`.

Input paths can be a file path, directory path or a [glob](https://en.wikipedia.org/wiki/Glob_(programming)).  Additionally, watcher options can be provided for more fine-grained control over file watching mechanics and performance. See the [chokidar](https://github.com/paulmillr/chokidar) documentation for more information.

Sample configuration file:

```json
{
  "messageServer": {
    "host": "127.0.0.1",
    "port": 6689
  },
  "inputs": [
    {
      "source": "server1",
      "stream": "app1",
      "config": {
        "path": "log.io-demo/file-generator/app1-server1.log"
      }
    },
    {
      "source": "server2",
      "stream": "system-logs",
      "config": {
        "path": "/var/log/**/*.log",
        "watcherOptions": {
          "ignored": "*.txt",
          "depth": 99,
        }
      }
    }
  ]
}

```

