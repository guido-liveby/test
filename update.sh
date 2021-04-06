#!/usr/bin/zsh


cd /home/guido/git/guido-liveby/test
node ./fetch.js
echo $(date) update >> update.log
