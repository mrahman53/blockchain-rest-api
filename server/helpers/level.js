(function () {
    "use strict";

    const level = require("level");

    module.exports = function (dataSource) {
        if (!dataSource) {
            throw new Error("Cannot proceed without Datasource");
        }

        const db = level(dataSource);

        return {

            getData(key) {
                return new Promise((resolve, reject) => {
                    db.get((key + "").toString(), function (err, value) {
                        return err && !value ? reject(err || new Error("Data not found")) : resolve(JSON.parse(value));
                    });
                });
            },

            setData(key, value) {
                return new Promise((resolve, reject) => {
                    db.put((key + "").toString(), value, function (err, value) {
                        return err ? reject(err) : resolve(value);
                    });
                });
            },
            getAllData() {
                return new Promise((resolve, reject) => {
                    let dataArray = [];
                    db.createReadStream()
                        .on("data", (data) => {
                            if (data.value) {
                                dataArray.push(JSON.parse(data.value));
                            }
                        })
                        .on("error", function (err) {
                            reject(err);
                        })
                        .on("end", function () {
                            resolve(dataArray);
                        });
                });
            }
        };
    }
}());