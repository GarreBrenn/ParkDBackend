var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/query',  async (req, res, next) => {
    let output = await main.query();
    parseAssets(output).then((output, bad) => {
        try {
            let input = req.body;
            if(input.startDate != null) {
                let startDate = new Date(input.startDate)
                output.filter((d) => {
                    let flag = true;
                    for(let entries in d.Record.Reservations) {
                        if((startDate > entries.resTimeIn && startDate < entries.resTimeOut) || (input.endDate > entries.resTimeIn && input.endDate < entries.resTimeOut)) {
                            flag = false;
                        }
                    }
                    return flag;
                })
            }
            if(input.price != null) {
                output.filter((d) => {
                    if(input.price < d.Price) {
                        return false;
                    }
                    return true;
                })
            }
            res.send(output);
        }
        catch(e) {
            res.send(e)
        }
    })

});
router.post('/buy', async (req, res, next) => {
    let output = await main.purchaseSpotAsset(req.body.id, req.body.timeIn, req.body.timeOut);
    res.send(output)
});
router.post('/sell', async (req, res, next) => {
    let output = await main.putAsset(
        req.body.id,req.body.latlong,req.body.address,req.body.type,
        req.body.photo,req.body.hostID,"Available",req.body.guestID,
        req.body.price,"","","","");
        return output;
    }
    )

router.post('/reserve', async (req, res, next) => {
    let allAssets = await main.query();
    parseAssets(allAssets).then(async (good, bad) => {
        for(let i = 0; i < good.length; i++) {
            if(good[i].Record.ID == req.body.id) {
                let curReservations = good[i].Record.Reservations;
                let flag = true;
                for(let j = 0; j < curReservations.length; j++) {
                    if((req.body.timeIn >= curReservations[j].resTimeIn && req.body.timeIn <= curReservations[j].resTimeOut) ||
                        req.body.timeOut >= curReservations[j].resTimeIn && req.body.timeOut <= curReservations[j].resTimeOut) {
                        flag = false;
                    }
                }
                if(flag) {
                    curReservations.push({
                        resTimeIn: req.body.timeIn,
                        resTimeOut: req.body.timeOut,
                        guestId: req.body.guestId
                    })
                    console.log(curReservations);
                    let returnval = await main.appendCheckin(1, curReservations);
                    console.log(returnval)
                    res.send("success :)")
                }
                else {
                    res.send("fail :(")
                }
                break;
            }
        }
    })
})
function parseAssets(asset) {
    return new Promise((resolve, reject) => {
        let output = JSON.parse(asset);
        if(output) {
            resolve(output);
        }
        else {
            reject(output);
        }
    })
}
module.exports = router;
