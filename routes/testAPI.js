var express = require("express");
var router = express.Router();
const authController = require('../controllers/auth');
const mysql = require("mysql");
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: 'localhost', // or change to public IP if using an SQL server on another computer
    user: 'root',
    password: '00098636', //not my phone password
    database: 'parkD'
});

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
router.post('/getreservation', async (req, res, next) => {
//THIS ASSUMES A GUEST ONLY MAKES ONE RESERVATION
    let output = await main.query();
    let reservationIndex = null;
    parseAssets(output).then((output, bad) => {
    	try {
    	    let input = req.body;
            console.log("input")
            console.log(input)
    	    if (input.spotID != null) {
    	    	output = output.filter((d) => {
                    if(input.spotID == d.Record.ID) {
                        for(let i = 0; i < d.Record.Reservations.length; i++) {
                            const reservation = d.Record.Reservations[i];
                            console.log(reservation)
                            console.log("input guest ID: " + input.guestID);
                    	     console.log("record spot ID: " + reservation.guestId);
                    	     if (reservation.guestId == input.guestID) {
                    	     	console.log("this should pass\n");
                    	     	reservationIndex = i;
                    	     	return true;
                    	     }
                        }
                    }
                    return false;
                })
                const response = {
                	valid: true ? output[0] != null : false,
                	spot: output[0],
                	reservationIndex: reservationIndex
                }
                res.send(response);
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
router.post('sell', async (req, res, next) => {
    let output = await main.putAsset(
        req.body.id,req.body.latlong,req.body.address,req.body.type,
        req.body.photo,req.body.hostID,"Available",req.body.guestID,
        req.body.price,"","","","");
        return output;
    }
    )
router.post('/checkin', async (req, res, next) => {
    try {
        let output = await main.checkIn(req.body.spotKey, req.body.CheckInTime, req.body.reservationIndex);
        res.send("bipityboo")
    }
    catch(e) {
        res.send(e)
    }
})
router.post('/checkout', async (req, res, next) => {
    try {
        let output = await main.checkOut(req.body.spotKey, req.body.CheckOutTime, req.body.reservationIndex);
        res.send("bipityboo")
    }
    catch(e) {
        res.send(e)
    }
})
router.post('/reserve', async (req, res, next) => {
    let allAssets = await main.query();
    parseAssets(allAssets).then(async (good, bad) => {
        for(let i = 0; i < good.length; i++) {
            if(good[i].Record.id === req.body.id) {
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
                        guestId: req.body.guestId,
                    })
                    await main.appendCheckin(req.body.id, curReservations);
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

router.post("/registe", authController.register)
router.post('/login', authController.login)
//router.post('/tempPage', authController.isLoggedIn) // one for each of the private pages once they're created. Buy, sell dashboard, browse, etc.


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

router.get('/isLoggedIn', async(req, res, next) =>{
    // check to see if jwt a cookie exists
    console.log("hello world");
    console.log(req);
    console.log(req.cookies);
    if (req.cookies.jwt){
        try{
            // check if the cookie token matches my super secret password as defined in the .env file
            const decoded = await promisify(jwt.verify)(req.cookies.jtw, process.env.JWT_SECRET);
            console.log(decoded);

            // check if the user still exists
            db.query('SELECT * FROM users WHERE email = ?', [decoded.email], (error, result) =>{
                console.log(result);
                if(!result){
                    return next();
                }
                req.userMail = result[0]; // email is the 0'th collumn in the database
                //res.user = result[0];
                return next();
            });
        }
        catch(error){
        console.log(error);
        return next();
        }
    }
    else{
        // the nerd isn't logged in
        //res.status(403).redirect('/login')
        next();
    }
    // do something else with the next()
    next();
})