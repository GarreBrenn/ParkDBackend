'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.txIndex = 0;
        this.assets = new Set(); // AssetIDs of any assets created by this workload
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        
        console.log("Initializing ledger with spot assets...")
        
        for (let i=0; i < this.roundArguments.totalTx; i++) {
		
		const spotID = `${this.workerIndex}_spot${i}`
        
		const myArgs = {
		    contractId: this.roundArguments.contractId,
		    contractFunction: 'RegisterSpotAsset',
		    contractArguments: [spotID, "32.7824_-79.9382", "39 Coming Street, Charleston, South Carolina", "Driveway", "photosNull", "hostID1", "Available", "guestIDNull", 10, "resTimeInNull", "resTimeOutNull", "checkTimeInNull", "checkTimeOutNull"],
		    readOnly: false
		};

		this.assets.add(spotID);

		await this.sutAdapter.sendRequests(myArgs);
        }
        console.log("Initialization complete.")
    }
    
    async submitTransaction() {
        const spotID = `${this.workerIndex}_spot${this.txIndex}`;
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'ReserveAsset',
            contractArguments: [spotID, [{resTimeIn: 199999, resTimeOut: 200000, guestId: 1}]],
            readOnly: false
        };

        this.txIndex++;
        await this.sutAdapter.sendRequests(myArgs);

    }
    
    async cleanupWorkloadModule() {
        for (const element of this.assets.values()) {
            console.log(`Worker ${this.workerIndex}: Deleting asset ${element}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'DeleteAsset',
                contractArguments: [element],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
