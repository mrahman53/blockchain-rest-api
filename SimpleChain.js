/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
let myBlockChain = new BlockChain.BlockChain();


setTimeout(function () {
    console.log("Waiting...")
}, 10000);

myBlockChain.validateChain().then((errorLog) => {
    if(errorLog.length > 0){
        console.log("The chain is not valid:");
        errorLog.forEach(error => {
            console.log(error);
        });
    } else {
        console.log("No errors found, The chain is Valid!");
     }
    }).catch((error) => {
        console.log(error);
    })


