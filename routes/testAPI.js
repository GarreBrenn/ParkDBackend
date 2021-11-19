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

            if(input.priceLow != null) {
                output = output.filter((d) => {
                    if(input.priceLow <= d.Record.Price) {
                        return true;
                    }
                    return false;
                })
            }

            if(input.priceHigh != null) {
                output = output.filter((d) => {
                    if(input.priceHigh >= d.Record.Price) {
                        return true;
                    }
                    return false;
                })
            }

            res.send(output);
        }
        catch(e) {
            res.send(e)
        }
    })

});
router.post('/getreservation', async (req, res, next) => {
    let output = await main.query();
    parseAssets(output).then((output, bad) => {
    	try {
    	    let input = req.body;
            console.log("input")
            console.log(input)
    	    if (input.spotID != null) {
    	    	output = output.filter((d) => {
                    if (d.Record.ID == input.spotID) {
                        console.log("1");
                        parseAssets(d.Record.Reservations).then(async (good, bad) => {
                            console.log(good);
                        })
                        console.log("2")
                        parseAssets(d.Record).then(async (good, bad) => {
                            console.log(good);
                        })
                        console.log("3")
                        parseAssets(d).then(async (good, bad) => {
                            console.log(good);
                        })
                    	// for(let reservation in parseAssets(d.Record.Reservations)) {
                        //     console.log("reservation");
                        //     console.log(reservation);
                    	//     console.log("input guest ID: " + input.guestID);
                    	//     console.log("record spot ID: " + reservation.guestId);
                    	//     if (reservation.guestId == input.guestID) {
                    	//     	console.log("this should pass\n");
                    	//     	return true;
                    	//     }
                    	// }
                    }
                    return false;
                })
                console.log("\n\noutput");
                console.log(output);
                console.log("after output");
                res.send(output);
    	    }
    	} catch(e) {
    	    res.send(e)
    	}
    });
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
                let timeIn = new Date(parseInt(req.body.timeIn));
                let timeOut = new Date(parseInt(req.body.timeOut));
                for(let j = 0; j < curReservations.length; j++) {
                    if((timeIn >= new Date(curReservations[j].resTimeIn) && timeIn <= new Date(curReservations[j].resTimeOut)) ||
                        (timeOut >= new Date(curReservations[j].resTimeIn) && timeOut <= new Date(curReservations[j].resTimeOut))) {
                        flag = false;
                    }
                }
                if(flag) {
                    curReservations.push({
                        resTimeIn: parseInt(req.body.timeIn),
                        resTimeOut: parseInt(req.body.timeOut),
                        guestId: req.body.guestId
                    })
                    await main.appendCheckin(req.body.id, JSON.stringify(curReservations));
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
