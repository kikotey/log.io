#!/bin/bash

npm cache clean --force

rm -Rf ui/node_modules
rm -Rf server/node_modules
rm -Rf inputs/file/node_modules
