delete require.cache[module.filename]; // always reload
const HERE = require("path").dirname(module.filename);

const sleepless = require("sleepless"),
    L = require("log5").mkLog("\tmicro: ")(5),
    sleepless_users = require("sleepless-users");

const CONFIG = {
    name: "micro.db"
};

const q = function(cb)
{
    require("db").sqlite3.connect(CONFIG, function(db)
    {
        if(!db)
        {
            L.E("failed to connect to server");
            return;
        }
        cb(db);
    }, err =>
    {
        L.E(err);
        return;
    });
};

const Auth = function()
{
    require("sleepless-users").connect("sqlite3", CONFIG, function(db)
    {
        if(!db)
        {
            L.E("failed to connect to server");
            return null;
        }
        return db;
    }, function(err)
    {
        L.E(err);
        return null;
    });
};

const query = function(method, sql, args, okay, fail)
{
    q(db =>
    {
        db?.query(sql, args, records =>
        {
            db.end();
            okay(records);
        }, err =>
        {
            db.end();
            fail(err);
        });
    });
};

module.exports = function(input, okay, fail)
{

    const {cmd, msg} = input;

    if(cmd == "ping")
    {
        okay("pong");
        return;
    }

    if(cmd == "register")
    {
        let user_id = msg.username;
        msg.data = {user_id};
        return Auth().user.register(msg, okay, fail);
    }

    if(cmd == "login")
    {
        let user_id = input.username;
        let password = input.password;
        return Auth().user.authenticate(msg, okay, fail);
    }

    if(cmd == "log")
    {
        log(msg);
        okay();
        return;
    }

    fail("Invalid action: " + cmd);
};

