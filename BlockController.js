const SHA256 = require('crypto-js/sha256');
const Block = require('./Block.js');
const BlockObject = require('./BlockChain.js');


class BlockController{
    constructor(app){
        this.app = app;
        this.blocks = [];
        this.blockchain = new BlockObject.BlockChain();
        this.initializeMockData();
        this.getLandingPage();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new Block.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

    getLandingPage(){
        this.app.get("/",(req,res) => {
            res.send("Welcome To Blockchain World");
        });
     }

    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            let index = req.params.index;
            try {
                console.log(`Trying to get block with index ${index}`);
                let result = this.blockchain.getBlock(index);
                res.set({
                    'Content-Type'   : 'application/json; charset=utf-8',
                    'Cache-Control'  : 'no-cache',
                    'Content-Length' : '179',
                    'Accept-Ranges'  : 'bytes'
                });
                res.status(200).json(result);
                res.end();
            }
            catch(err) {
                console.log(`Bad request: ${err}`);
                res.status(400).send(`Bad request: ${err}`);
            }
        });
    }

    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            let body = req.body.body;
            try {
                if (body) {
                    let result = this.blockchain.addBlock(new Block.Block(body));
                    res.set({
                        'Content-Type'   : 'application/json; charset=utf-8',
                        'Cache-Control'  : 'no-cache',
                        'Content-Length' : '179',
                        'Accept-Ranges'  : 'bytes'
                    });
                    res.status(200).json(result);
                    res.end();
                }
                else {
                    console.log("Bad request: Empty body");
                    res.status(400).send("Bad request: Empty body");
                    res.end();
                }
            }
            catch(err) {
                console.log(`Bad request: ${err}`);
                res.status(400).send(`Bad request: ${err}`);
            }
        });
    }

}module.exports = (app) => {return new BlockController(app);}