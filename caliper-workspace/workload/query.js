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

        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'InitLedger',
            contractArguments: [],
            readOnly: true
        };

        console.log("Initializing ledger with spot assets...")
        await this.sutAdapter.sendRequests(myArgs);
        console.log("Initialization complete.")
    }
    
    async submitTransaction() {
        
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'GetAllAssets',
            contractArguments: [],
            readOnly: true
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