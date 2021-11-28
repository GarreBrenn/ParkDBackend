/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./utils/CAUtil');
const { buildCCPOrg1, buildWallet } = require('./utils/AppUtil');
let ccp;
let caClient;
let wallet;
const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		const gateway = new Gateway();

			try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			const returner = await contract.submitTransaction('InitLedger')
			if (`${returner}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
		}
		finally {
			gateway.disconnect();
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}
async function putAsset(id, lat_long, address, type, photo, hostID, state, guestID, price, resTimeIn, resTimeOut, checkInTime, checkOutTime) {
	let result;
	 	
		const gateway = new Gateway();

		try {

			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			result = await contract.submitTransaction('RegisterSpotAsset', id, lat_long, address, type, photo, hostID, state, guestID, price, resTimeIn, resTimeOut, checkInTime, checkOutTime);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}

			//console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
			//result = await contract.evaluateTransaction('ReadAsset', 'asset13');
			//console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
}

async function purchaseSpotAsset(id, guestID, timeIn, timeOut){
	let result;
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			result = await contract.submitTransaction('purchaseSpotAsset', id, guestID, timeIn, timeOut);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
		} finally {
			return result;
			gateway.disconnect();
		}
}
async function disableSpotAsset(id){
	let result;
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			result = await contract.submitTransaction('disableSpotAsset', id);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
		} finally {
			gateway.disconnect();
		}
}
async function updateAssetP(id, price, photos, state){
	let result;
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			result = await contract.submitTransaction('updateAssetP', id, price, photos, state);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
		} finally {
			gateway.disconnect();
		}
}
async function checkIn(id, checkInTime, reservationIndex){
	let result;
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			result = await contract.submitTransaction('checkIn', id, checkInTime, reservationIndex);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
		} finally {
			gateway.disconnect();
		}
}
async function checkOut(id, checkOutTime, reservationIndex){
	let result;
		const gateway = new Gateway();
		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			result = await contract.submitTransaction('checkOut', id, checkOutTime, reservationIndex);
			if (`${result}` !== '') {
				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			}
		} finally {
			gateway.disconnect();
		}
}
async function deleteAsset(id){
	let result;
	const gateway = new Gateway();
	try {
		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});
		const network = await gateway.getNetwork(channelName);

		const contract = network.getContract(chaincodeName);

		result = await contract.submitTransaction('DeleteAsset', id);
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		}
	} finally {
		gateway.disconnect();
	}
}
async function query() {
	let result;
	// Create a new gateway instance for interacting with the fabric network.
// In a real application this would be done as the backend server session is setup for
// a user that has been verified.
const gateway = new Gateway();

try {
   // setup the gateway instance
   // The user will now be able to create connections to the fabric network and be able to
   // submit transactions and query. All transactions submitted by this gateway will be
   // signed by this user using the credentials stored in the wallet.
   await gateway.connect(ccp, {
	   wallet,
	   identity: org1UserId,
	   discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
   });

   // Build a network instance based on the channel where the smart contract is deployed
   const network = await gateway.getNetwork(channelName);

   // Get the contract from the network.
   const contract = network.getContract(chaincodeName);

   result = await contract.evaluateTransaction('GetAllAssets');
   console.log('*** Result: evaluated');
   if (`${result}` !== '') {
	   console.log(`*** Result: ${prettyJSONString(result.toString())}`);
   }

} finally {
   // Disconnect from the gateway when the application is closing
   // This will close all connections to the network
   gateway.disconnect();
   return result;
}
}

async function appendCheckin(id, reservation) {
	let result;
	// Create a new gateway instance for interacting with the fabric network.
// In a real application this would be done as the backend server session is setup for
// a user that has been verified.
	const gateway = new Gateway();

	try {
		// setup the gateway instance
		// The user will now be able to create connections to the fabric network and be able to
		// submit transactions and query. All transactions submitted by this gateway will be
		// signed by this user using the credentials stored in the wallet.
		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
			discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
		});

		// Build a network instance based on the channel where the smart contract is deployed
		const network = await gateway.getNetwork(channelName);

		// Get the contract from the network.
		const contract = network.getContract(chaincodeName);

		result = await contract.submitTransaction('ReserveAsset', id, reservation);
		console.log('*** Result: evaluated');
		if (`${result}` !== '') {
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		}

	} finally {
		// Disconnect from the gateway when the application is closing
		// This will close all connections to the network
		gateway.disconnect();
		return result;
	}
}


module.exports = {main, putAsset, query, purchaseSpotAsset, appendCheckin, checkIn, checkOut, deleteAsset, updateAssetP};