var express = require("express");
var router = express.Router();
var main = require("../testBlockchain");
router.post('/query',  async (req, res, next) => {
    const output = await main.query();
    res.send(output);
});   

module.exports = router;