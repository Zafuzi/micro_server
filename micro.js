delete require.cache[module.filename]; // always reload
const HERE = require("path").dirname( module.filename );
const L = require("log5").mkLog("\tapi: ")(5);

module.exports = class Micro {
	constructor( data, okay, fail ) {
		this.data 	= data;
		this.okay 	= okay;
		this.fail 	= fail;
		// setup a database connection
		try {
			this.config = j2o( require("fs").readFileSync( __dirname+"/config.json", { encoding: "utf8" }) );
		} catch( config_err ) {
			L.E( "failed to load config", config_err );
		} finally {
			if( ! this.config ) {
				L.E( "failed to load config" );
			}
		}
	}
	log() {
		L.D( this.data?.msg || "no message" );
		this.okay();
	}
	ping() { this.okay("okay"); }
}
