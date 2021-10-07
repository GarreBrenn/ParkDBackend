#!/bin/bash
cd ./test-network/
chmod +x network.sh
. ./network.sh down
. ./network.sh up createChannel -c mychannel -ca
. ./network.sh deployCC -ccn basic -ccp ../chaincode-javascript/ -ccl javascript
cd ..
npm start
