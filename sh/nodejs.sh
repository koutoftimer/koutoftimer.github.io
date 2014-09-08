#!/bin/bash

# Modified from https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
apt-get update
apt-get install -y python-software-properties python g++ make
add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs
chown -R `whoami` ~/.npm
chown -R `whoami` /usr/local/lib/node_modules
sudo npm install -g yo bower grunt grunt-cli generator-angular