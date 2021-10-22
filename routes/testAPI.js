var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/query',  async (req, res, next) => {
    let output = await main.query();
    if(req.body.startDate != null) {
        let startDate = new Date(req.body.startDate)
        output.filter((d) => {
            if(startDate < d.ReservationTimeIn) {
                return false;
            }
            return true;
        })
    }
    if(req.body.endDate != null) {
        let endDate = new Date(req.body.endDate)
        output.filter((d) => {
            if(endDate > d.ReservationTimeOut) {
                return false;
            }
            return true;
        })
    }
    if(req.body.price != null) {
        output.filter((d) => {
            if(req.body.price < d.Price) {
                return false;
            }
            return true;
        })
    }
    res.send(output);
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

module.exports = router;