delete require.cache[module.filename]; // always reload

const HERE = require("path").dirname(module.filename);
const sleepless = require("sleepless");
const L = require("log5").mkLog("\tmicro: ")(5);
const sleepless_users = require("sleepless-users");

const methods = {
    ...require("./auth.js")?.methods,
    ping: function(msg, okay, fail)
    {
        okay("pong");
        return true;
    }
}

module.exports = function(input, okay, fail)
{
    const {cmd, msg} = input;
    
    if(methods[cmd])
    {
        methods[cmd](msg, okay, fail);
        return;
    }

    fail("Invalid action: " + cmd);
};

