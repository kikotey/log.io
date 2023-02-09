#!/bin/bash


sudo npm install pm2 -g
basedir=$(pwd) 
cd $basedir/inputs/file && npm install && npm fund && npm run build && npm run prepare
cd $basedir/ui && npm run build && npm fund
cd $basedir/server && npm install && npm fund && npm run build && npm run prepare
