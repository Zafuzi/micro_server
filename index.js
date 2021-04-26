
delete require.cache[module.filename]; // always reload
const HERE = require("path").dirname( module.filename );

const	path			= require("path"),
		fs				= require("fs"),
		connect			= require("connect"),
		serve_static 	= require( "serve-static" ),
		L				= require("log5").mkLog("\tmicro_server: ")(5);

require( "sleepless" ).globalize();


// RPC Controller
const rpc = function( req, res, next ) {

	const done = ( error, data ) => {
		if(error) L.E(o2j(error));
		let json = JSON.stringify( { error, data } );
		res.writeHead( 200, {
			"Cache-Control": "max-age=0, no-store",
			"Content-Type": "application/json",
		});
		res.write( json );
		res.end();
		next();
	};
	const fail = ( error, data ) => { done( error, data ); };
	const okay = ( data ) => { done( null, data ); };

	let body 	= req.method == "GET" ? req.query : req.body;

	let cmd 	= body.cmd;
	if( ! cmd ) {
		fail( "No command given" );
		return;
	}

	const Micro = require("./micro.js");
	let m = new Micro( body, okay, fail );
	if( ! m[cmd] ) {
		fail( `Command does not exist: ${cmd}` );
		return;
	}

	L.D( "got here" );

	m[cmd]();
}

const app = connect();

app.use( require( "body-parser" ).json() );
app.use( require( "cookie-parser" )() );
app.use( require( "compression" )() );
//app.use( require( "cors" )() );
app.use( ( req, res, next ) => {
	req.query = require('querystring').parse( req._parsedUrl.query );
	next();
});

// API path handler
app.use( ( req, res, next ) => {
	if( /GET|POST/.test( req.method ) && req.url.startsWith( "/api/" ) ) {
		rpc( req, res, next );
		return;
	}
	next();
});

// Serve statics files
app.use( serve_static( HERE + "/frontend" ) );

module.exports = app;

