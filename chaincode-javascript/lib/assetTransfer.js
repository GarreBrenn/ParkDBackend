/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
            ID: "1", 
            LatLong: "32.7824_-79.9382", 
            Address: "39 Coming Street, Charleston, South Carolina", 
            Type: "Driveway", 
            Photos: "photosNull", 
            HostID: "hostID1", 
            GuestID: "guestIDNull", 
            Price: 10,
            Reservations: [{
                resTimeIn: 199999,
                resTimeOut: 200000,
                guestId: 1
            }],
            ReservationTimeIn: "resTimeInNull", 
            ReservationTimeOut: "resTimeOutNull", 
            CheckInTime: "checkTimeInNull", 
            CheckOutTime: "checkTimeOutNull",
            State: "Available" 
            },
            {
                ID: "2", 
                LatLong: "32.782820_-79.938293", 
                Address: "58 Coming St, Charleston, South Carolina", 
                Type: "Street", 
                Photos: "photosNull", 
                HostID: "hostID2", 
                GuestID: "guestIDNull", 
                Price: 5,
                Reservations: [{
                    resTimeIn: 199999,
                    resTimeOut: 200000,
                    guestId: 1
                }],
                ReservationTimeIn: "resTimeInNull", 
                ReservationTimeOut: "resTimeOutNull", 
                CheckInTime: "checkTimeInNull", 
                CheckOutTime: "checkTimeOutNull",
                State: "Available" 
            },
            {
                ID: "3", 
                LatLong: "32.7844_-79.9382", 
                Address: "99 Coming Street, Charleston, South Carolina", 
                Type: "Driveway", 
                Photos: "photosNull", 
                HostID: "hostID1", 
                GuestID: "guestIDNull", 
                Price: 10,
                Reservations: [{
                    resTimeIn: 199999,
                    resTimeOut: 200000,
                    guestId: 1
                }],
                ReservationTimeIn: "resTimeInNull", 
                ReservationTimeOut: "resTimeOutNull", 
                CheckInTime: "checkTimeInNull", 
                CheckOutTime: "checkTimeOutNull",
                State: "Available" 
                },
                {
                    ID: "4", 
                    LatLong: "32.782620_-79.938493", 
                    Address: "22 Coming St, Charleston, South Carolina", 
                    Type: "Street", 
                    Photos: "photosNull", 
                    HostID: "hostID2", 
                    GuestID: "guestIDNull", 
                    Price: 5,
                    Reservations: [{
                        resTimeIn: 199999,
                        resTimeOut: 200000,
                        guestId: 1
                    }],
                    ReservationTimeIn: "resTimeInNull", 
                    ReservationTimeOut: "resTimeOutNull", 
                    CheckInTime: "checkTimeInNull", 
                    CheckOutTime: "checkTimeOutNull",
                    State: "Available" 
                },
                {
                    ID: "5", 
                    LatLong: "32.7834_-79.9482", 
                    Address: "41 Coming Street, Charleston, South Carolina", 
                    Type: "Driveway", 
                    Photos: "photosNull", 
                    HostID: "hostID1", 
                    GuestID: "guestIDNull", 
                    Price: 10,
                    Reservations: [{
                        resTimeIn: 199999,
                        resTimeOut: 200000,
                        guestId: 1
                    }],
                    ReservationTimeIn: "resTimeInNull", 
                    ReservationTimeOut: "resTimeOutNull", 
                    CheckInTime: "checkTimeInNull", 
                    CheckOutTime: "checkTimeOutNull",
                    State: "Available" 
                    },
                    {
                        ID: "6", 
                        LatLong: "32.782822_-79.938296", 
                        Address: "60 Coming St, Charleston, South Carolina", 
                        Type: "Street", 
                        Photos: "photosNull", 
                        HostID: "hostID2", 
                        GuestID: "guestIDNull", 
                        Price: 5,
                        Reservations: [{
                            resTimeIn: 199999,
                            resTimeOut: 200000,
                            guestId: 1
                        }],
                        ReservationTimeIn: "resTimeInNull", 
                        ReservationTimeOut: "resTimeOutNull", 
                        CheckInTime: "checkTimeInNull", 
                        CheckOutTime: "checkTimeOutNull",
                        State: "Available" 
                    },
                    {
                        ID: "7", 
                        LatLong: "32.7876_-79.9376", 
                        Address: "222 Coming Street, Charleston, South Carolina", 
                        Type: "Driveway", 
                        Photos: "photosNull", 
                        HostID: "hostID1", 
                        GuestID: "guestIDNull", 
                        Price: 10,
                        Reservations: [{
                            resTimeIn: 199999,
                            resTimeOut: 200000,
                            guestId: 1
                        }],
                        ReservationTimeIn: "resTimeInNull", 
                        ReservationTimeOut: "resTimeOutNull", 
                        CheckInTime: "checkTimeInNull", 
                        CheckOutTime: "checkTimeOutNull",
                        State: "Available" 
                        },
                        {
                            ID: "8", 
                            LatLong: "32.782840_-79.938223", 
                            Address: "1 Coming St, Charleston, South Carolina", 
                            Type: "Street", 
                            Photos: "photosNull", 
                            HostID: "hostID2", 
                            GuestID: "guestIDNull", 
                            Price: 5,
                            Reservations: [{
                                resTimeIn: 1637121835000,
                                resTimeOut: 1637125835000,
                                guestId: 1
                            }],
                            ReservationTimeIn: "resTimeInNull", 
                            ReservationTimeOut: "resTimeOutNull", 
                            CheckInTime: "checkTimeInNull", 
                            CheckOutTime: "checkTimeOutNull",
                            State: "Available" 
                        }
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }
    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }
    async RegisterSpotAsset(ctx, id, lat_long, address, type, photo, hostID, state, guestID, price, resTimeIn, resTimeOut, checkInTime, checkOutTime) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }
        const asset = {
            ID: id, 
            LatLong: lat_long, 
            Address: address, 
            Type: type, 
            Photos: photo, 
            HostID: hostID, 
            GuestID: guestID, 
            Price: price,
            Reservation: [],
            ReservationTimeIn: resTimeIn, 
            ReservationTimeOut: resTimeOut, 
            CheckInTime: checkInTime, 
            CheckOutTime: checkOutTime,
            State: state
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }
    async purchaseSpotAsset(ctx, id, guestID, timeIn, timeOut) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.State = "Rented";
        asset.GuestID = guestID;
        asset.ReservationTimeIn = timeIn;
        asset.ReservationTimeOut = timeOut;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
    async disableSpotAsset(ctx, id) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.State = "Unavailable";
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
    async updateAssetP(ctx, id, price, photos, state) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        if(price) {
            asset.Price = price;
        }
        if(photos) {
            asset.Photos = photos;
        }
        if(state){
            asset.State = state;
        }
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
    async checkIn(ctx, id, checkInTime, reservationIndex) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Reservations[reservationIndex].checkInTime = checkInTime;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
    async checkOut(ctx, id, checkOutTime, reservationIndex) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Reservations[reservationIndex].checkOutTime = checkOutTime;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Owner = newOwner;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async ReserveAsset(ctx, id, reservation) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        let res = JSON.parse(reservation)
        asset.Reservations = res;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }
}

module.exports = AssetTransfer;
