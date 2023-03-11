const HERE = require("path").dirname(module.filename);
const L = require("log5").mkLog("\tmicro lib: ")(5);

const DB_CONFIG = {
    name: "micro.db"
};

const q = function(cb)
{
    require("db").sqlite3.connect(DB_CONFIG, function(db)
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

const query = function(sql, args, okay, fail)
{
    q(db =>
    {
        if(!db)
        {
            fail("failed to connect to database");
            return;
        }
        
        db.query(sql, args, records =>
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


module.exports = {
    DB_CONFIG,
    query
}