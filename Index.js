
const express = require("express");
const bodyParser = require("body-parser");

class Index {
    constructor() {
        this.app = express();
        this.initExpress();
        this.initExpressMiddleWare();
        this.initControllers();
        this.start();
    }

    initExpress() {
        this.app.set("port", 8000);
    }

    initExpressMiddleWare() {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
    }
    initControllers() {
        require("./BlockController.js")(this.app);
    }

    start() {
        let self = this;
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server Listening on port: ${self.app.get("port")}`);
        });
    }
}new BlockAPI();