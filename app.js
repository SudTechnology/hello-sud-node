const Express = require('express');
const BodyParser = require('body-parser');
const Partials = require('express-partials');
const Http = require("http");

let expressApp = Express();
expressApp.use(Partials());
expressApp.use(BodyParser.json({limit: "50mb"}));
expressApp.use(BodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
require("./route/index.js").create(expressApp);
Http.createServer(expressApp).listen(8080, function() {
    console.log('server start success!');
});