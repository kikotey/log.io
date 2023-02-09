#!/bin/bash
# Action to execute (mandatoty)
action="$1"  
# Friendly service name (optional)
serviceName=cli
# Command to run (optional, array variable)
command=()
# Working Directory (optional)
#workDir=
# On start (optional, array variable)
#onStart=()
# On finish (optional, array variable)
#onFinish=()

@e() {
  echo "# $*"
}

@warn() {
  @e "Warning: $*" >&2
}

@err() {
  @e "Error! $*" >&2
  exit 1
}

#https://medium.com/idomongodb/how-to-npm-run-start-at-the-background-%EF%B8%8F-64ddda7c1f1
package='pm2'
if [ `npm list -g $package  | grep -c $package` -eq 0 ]; then
    npm install $package --no-shrinkwrap
fi

# Service menu
function main() {
  case "$action" in
    start)
      @serviceStart
      ;;
    stop)
      @serviceStop
      ;;
    restart)
      @serviceRestart
      ;;
    status)
      @serviceStatus
      ;;
    debug)
      @serviceDebug
      ;;
    *)
      @e "Usage: {start|stop|restart|status|debug}"
      exit 1
      ;;
  esac
}

@serviceStart() {
  pm2 --name listener-server start debugger-listener-server && sleep 5s &&  pm2 --name stream-loader start debugger-stream-loader
  pm2 ps
  pm2 logs
}

@serviceStop() {
  pm2 delete 0
  pm2 delete 1
  pm2 delete 2
}

@serviceRestart() {
  @serviceStop
  sleep 2
  @serviceStart
}

@serviceStatus() {
  pm2 ps
  cat ~/.kiko-cli/config/file.json
  cat ~/.kiko-cli/server.json
}


@serviceDebug() {
  pm2 log
}

main "$@"
