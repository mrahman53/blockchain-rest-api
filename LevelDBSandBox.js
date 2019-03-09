/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelDBSandBox {

    constructor() {
        this.db = level(chainDB);
    }

    addLevelDBData(key,value){
        let self = this;
        return new Promise(function(resolve,reject){
            self.db.put(key,value,function(err){
                if(err){
                    console.log('New Block'+ key + 'Insertion failed');
                    reject(err);
                }
                resolve(value);
            });

        });
    }
    getLevelDBData(key) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.db.get(key,(err,value)=> {
                if(err){
                    console.log('Expected Block not found', err);
                    reject(err);
                }
                resolve(value);
            })
        });

    }

    getHeight(){
        let self = this;
        return new Promise(function(resolve, reject) {
            let count = -1;
            self.db.createReadStream()
                .on('data', function (data) {
                    // Count each object inserted
                    count++;
                })
                .on('error', function (err) {
                    // reject with error
                    console.log("error of get count");
                    reject(err);
                })
                .on('close', function () {
                    //resolve with the count value
                    //console.log("count is" + count);

                    resolve(count);//to get block height, subtract 1
                });
        })
    }

}module.exports.LevelDBSandBox = LevelDBSandBox;
