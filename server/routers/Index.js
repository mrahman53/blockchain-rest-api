(function () {
    "use strict";


    module.exports = function (app, blockchain) {
        require("./blockHandler")(app, blockchain);
    }

}());