(function () {
    "use strict";

    require("dotenv").config({
        "silent": true
    });

    const appPort = process.env.APP_PORT || process.env.PORT || 8000;
    const fs = require("fs");
    const express = require("express");
    const helmet = require("helmet");
    const app = express();
    let server;
    if (process.env.LOCAL_HTTPS) {
        server = require("https").createServer({
            "hostname": "localhost",
            "agent": false,
            "key": fs.readFileSync("./root/certificates/local/localhost-privkey.pem"),
            "cert": fs.readFileSync("./root/certificates/local/localhost-cert.pem"),
            "rejectUnauthorized": false
        }, app);
    } else {
        server = require("http").createServer(app);
    }
    const cookieSession = require("cookie-session");
    const cookieParser = require("cookie-parser");
    const compress = require("compression");
    const engines = require("consolidate");
    const morgan = require("morgan");
    const blockchain = require("./server/helpers/blockchain")();

    app.use(helmet());
    app.use(compress());
    app.use(cookieParser());
    app.use(cookieSession({
        "secret": process.env.APP_SECRET || "secret",
        "maxAge": 80000,
        "saveUninitialized": false,
        "resave": false,
        "name": "blockchain_web_service",
        "key": "blockchain",
        "cookie": {
            "secure": true,
            "httpOnly": true
        }
    }));

    app.engine("html", engines.ejs);
    app.set("view engine", "ejs");
    app.set("views", __dirname + "/client");
    app.use(express.static(__dirname + "/client"));
    app.use(express.json());
    app.use(express.urlencoded({
        "extended": true,
        "limit": "10mb"
    }));

    if (process.env.DEBUG) {
        app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
    }

    blockchain.init().then((chain) => {
        console.log(chain);
        console.log("Chain logged above");
        server.listen(appPort, () => {
            console.log(`Server listening to HTTP on ${appPort}`);
            require("./server/routers/index")(app, blockchain);
        });
    }).catch((err) => {
        console.log(err);
    });

}());