
delete require.cache[module.filename]; // always reload
const HERE = require("path").dirname( module.filename );

require( "sleepless" ).globalize();

console.log("h " + process.env.HOSTNAME );
console.log("u " + process.env.USERNAME );
console.log("p " + process.env.PASSWORD );
console.log("d " + process.env.DATABASE );

module.exports = function( input, okay, fail ) {

	const { cmd, msg } = input;

	if( cmd == "ping" ) {
		okay( "pong" );
		return;
	}

	if( cmd == "log" ) {
		log( msg );
		okay();
		return;
	}

	fail( "Invalid action: " + cmd );

};

