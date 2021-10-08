var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/', (req, res, next) => {
    let data = req.body;
    main.putAsset(data.id, data.lat_long, data.address, data.type, data.photo, data.hostID, data.state, 
        data.guestID, data.price, data.resTimeIn, data.resTimeOut, data.checkInTime, data.checkOutTim).then(() => {
        res.send(main.query());
    });
    
});   

module.exports = router;