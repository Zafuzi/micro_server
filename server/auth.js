// const {DB_CONFIG} = require("./lib");
const L = require("log5").mkLog("\tmicro Auth: ")(4);

const Auth = function()
{
    /* disabled until sleepless-users is updated to support sqlite3
    require("sleepless-users").connect("sleepless", DB_CONFIG, function(db)
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
     */
    
    return {
        user: {
            register(msg, okay, fail){
                L.I("register", msg);
                okay("registered");
            },
            authenticate(msg, okay, fail){
                L.I("authenticate", msg);
                okay("authenticated");
            }
        }
    };
};

module.exports = {
    Auth,
    methods: 
    {
        register(msg, okay, fail)
        {
            let user_id = msg.username;
            msg.data = {user_id};
            Auth()?.user.register(msg, okay, fail);
        },
        login(msg, okay, fail)
        {
            Auth()?.user.authenticate(msg, okay, fail);
        }
    }
}