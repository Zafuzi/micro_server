delete require.cache[module.filename]; // always reload

const methods = {
    ...require("./auth.js")?.methods,
    ping: function(msg, okay)
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

