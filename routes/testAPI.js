var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/', (req, res, next) => {
    let data = req.body;
    main.putAsset(data.id, data.owner, data.location, data.price).then(() => {
        res.send(main.query());
    });
    
});

module.exports = router;