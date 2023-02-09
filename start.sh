#!/bin/bash
#https://medium.com/idomongodb/how-to-npm-run-start-at-the-background-%EF%B8%8F-64ddda7c1f1
cd server && pm2 --name inputs start npm -- start && sleep 5s && cd ../inputs/file && pm2 --name server start npm -- start
pm2 ps
pm2 logs
echo "stop process with this command line << pm2 delete 0 >> for example"
