var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/query',  async (req, res, next) => {
    let output = await main.query();
    console.log(req.body)
    try {
        let input = req.body;
        if(input.startDate != null) {
            let startDate = new Date(input.startDate)
            output.filter((d) => {
                if(startDate < d.ReservationTimeIn) {
                    return false;
                }
                return true;
            })
        }
        if(input.endDate != null) {
            let endDate = new Date(input.endDate)
            output.filter((d) => {
                if(endDate > d.ReservationTimeOut) {
                    return false;
                }
                return true;
            })
        }
        if(input.price != null) {
            output.filter((d) => {
                if(input.price[1] < d.Price) {
                    return false;
                }
                else if(input.price[0] > d.Price) {
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

module.exports = router;