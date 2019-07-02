(function () {
    "use strict";


    module.exports = function (app, blockchain) {

        app.get("/block/:blockHeight", function (req, res) {
            blockchain.getBlock(
                req.params.blockHeight
            ).then((blockData) => {
                return res.status(200).send(blockData);
            }).catch(err => {
                return res.status(err.status || 500).send(err.message || err);
            });
        });

        app.get("/chainLength", function (req, res) {
            blockchain.getBlockHeight(
            ).then((blockHeight) => {
                return res.status(200).send({
                    "chainLength": blockHeight
                });
            }).catch(err => {
                return res.status(err.status || 500).send(err.message || err);
            });
        });

        app.get("/chain", function (req, res) {
            blockchain.getAllBlocks(
            ).then((blocks) => {
                return res.status(200).send(blocks || []);
            }).catch(err => {
                return res.status(err.status || 500).send(err.message || err);
            });
        });

        app.post("/block", function (req, res) {
            blockchain.addBlock({
                "body": req.body.blockBody || req.body.body
            }).then(result => {
                return res.status(201).send(result);
            }).catch(err => {
                return res.status(err.status || 500).send(err.message || err);
            });
        });

    }

}());