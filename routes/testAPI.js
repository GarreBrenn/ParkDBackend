var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/query',  async (req, res, next) => {
    let output = await main.query();
    try {
        let input = req.body;
        if(input.startDate != null) {
            let startDate = new Date(input.startDate)
            output.filter((d) => {
                let flag = true;
                for(let entries in d.Reservations) {
                    if(!(startDate > entries.resTimeIn && input.endDate > entries.resTimeOut) || !(startDate < entries.resTimeIn && input.endDate < entries.resTimeOut)) {
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
});
router.post('/buy', async (req, res, next) => {
    let output = await main.purchaseSpotAsset(req.body.id, req.body.timeIn, req.body.timeOut);
    res.send(output)
});
router.post('sell', async (req, res, next) => {
    let output = await main.putAsset(
        req.body.id,req.body.latlong,req.body.address,req.body.type,
        req.body.photo,req.body.hostID,"Available",req.body.guestID,
        req.body.price,"","","","");
        return output;
    }
    )

router.post('/reserve', async (req, res, next) => {
    let output = await main.query();
    for(let i = 0; i < output.length; i++) {
        console.log(output[i])
        //if(asset.id == req.body.id) {
            //let curReservations = asset.Reservations;
            //curReservations.push({
            //    resTimeIn: req.body.timeIn,
            //    resTimeOut: req.body.timeOut,
            //    guestId: req.body.guestId,
            //})
            //await main.appendCheckin(req.body.id, curReservations);
            //break;
        //}
    }
})

module.exports = router;