(function () {
    "use strict";
    // create chain in levelDB
    const Block = require("../Block");
    const levelDB = require("../levelDBSandBox");

    module.exports = function (chainName = "Blockchain") {
        const chainStore = levelDB(chainName);
        let chain = [];
        return {
            // add new block to an existing chain, takes "body" as blockData
            addBlock(blockData)  {
                if (!blockData) {
                    throw new Error("Block missing data, please add data");
                }
                if (chain && chain.length) {
                    blockData.previousBlockHash = chain[chain.length - 1].hash;
                    blockData.height = chain.length;
                }

                let block = new Block(blockData);

                return new Promise((resolve, reject) => {
                    chainStore.setData(
                        chain.length,
                        JSON.stringify(block)
                    ).then(() => {
                        console.log(`Block #${block.height} added with hash: ${block.hash}`);
                        chain.push(block);
                        resolve(block);
                    }).catch(err => reject(err));
                });
            },

            // get block by block height

            getBlock(blockHeight) {
                return new Promise((resolve, reject) => {
                    if (!blockHeight < 0) {
                        return reject(new Error("Enter valid block height"))
                    }
                    chainStore.getData(
                        blockHeight
                    ).then(block => resolve(block)
                    ).catch(err => reject(err));
                });
            },

            getBlockHeight() {
                return new Promise((resolve, reject) => {
                    chainStore.getAllData(

                    ).then(data => resolve(data.length)
                    ).catch(err => reject(err));
                });
            },

            // retreive all blocks within the chain

            getAllBlocks() {
                return new Promise((resolve, reject) => {
                    chainStore.getAllData(

                    ).then(data => {
                        resolve(data.sort((a, b) => {
                            return a.height - b.height;
                        }))
                    }).catch(err => reject(err));
                });
            },

            // Function to validate a particular block

            validateBlock(block, blockIndex) {
                let hashToTest = block.hash;
                this.getBlock(block.height).then(block => {
                    let copiedBlock = new Block(block);
                    if (hashToTest === copiedBlock.hash &&
                        (blockIndex >= 1 ? chain[blockIndex - 1].hash === block.previousBlockHash : true)) {
                        return true;
                    } else {
                        throw new Error(`Error found at # ${block.height}`);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // function to validate chain

            validateChain() {
                chain.forEach((blockData, index) => {
                    this.validateBlock(blockData, index);
                });
                console.log(`Chain with ${chain.length} blocks validated`);
                return true;
            },

            // function to create the first/genesis block in the chain

            createGenesisBlock() {
                return new Promise((resolve, reject) => {
                    if (chain && chain.length) {
                        return reject(new Error("Chain already exists!! Can't add genesis block"));
                    }
                    this.addBlock({
                        "body": "genesis block"
                    }).then(newBlock => resolve(newBlock)
                    ).catch(err => reject(err));
                });
            },

            // init to configure an already existing chain

            init() {
                return new Promise((resolve, reject) => {
                    this.getAllBlocks(

                    ).then((dbData) => {
                        if (dbData && dbData.length) {
                            chain = dbData;
                            this.addBlock({
                                "body": "genesis block"
                            }).then(newBlock => resolve(newBlock)
                            ).catch(err => reject(err));
                            console.log("Validating existing chain");
                            this.validateChain();
                            resolve(chain);
                        } else {
                            this.createGenesisBlock(
                            ).then(genesisBlock => {
                                console.log(`New chain created with Genesis Block: ${genesisBlock.hash}`);
                                resolve(chain)
                            });
                        }

                    }).catch(err => {
                        reject(err);
                    });
                });
            }
        };
    }
}());