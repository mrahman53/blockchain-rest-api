(function () {
    "use strict";

    const SHA256 = require("crypto-js/sha256");

    module.exports = function Constructor(payload = {}) {
        if (!payload || !payload.body) {
            throw new Error("Cannot create block without parameters");
        }

        this.height = payload.height || 0;
        this.body = payload.body;
        this.time = payload.time || new Date().getTime().toString().slice(0, -3);
        this.previousBlockHash = payload.previousBlockHash || "";
        this.hash = SHA256(JSON.stringify(this)).toString();

        return this;
    }

}());