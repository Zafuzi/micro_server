delete require.cache[module.filename]; // always reload

const HERE = require("path").dirname(module.filename);
const sleepless = require("sleepless");
const connect = require("connect");
const serve_static = require("serve-static");
const L = sleepless.log5.mkLog("\tmicro_server: ")(5);
const dotenv = require('dotenv');
const app = connect();

dotenv.config();
app.use(require("body-parser").json());
app.use(require("cookie-parser")());
app.use(require("compression")());
//app.use( require( "cors" )() );	// enable to handle requests from other domains
app.use(sleepless.mw_fin_json);		// adds okay, fail to res (defined in sleepless module)
app.use((req, res, next) =>
{
    req.query = require('querystring').parse(req["_parsedUrl"]?.query);
    next();
});

// API path handler
app.use((req, res, next) =>
{
    const {method, url, query, body} = req;
    L.V(method + " " + url);
    if(/GET|POST/.test(method) && url.startsWith("/server/"))
    {
        try
        {
            const path = HERE + "/server";
            const mod = require(path);
            const input = (method === "GET") ? query : body;
            mod(input, res.okay, res.fail);
        }
        catch(e)
        {
            L.E(e.stack);
            next();
        }
        return;
    }
    next();
});

// Serve client files
app.use(serve_static(HERE + "/client"));

module.exports = app;
