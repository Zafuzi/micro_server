const 	express 	= require("express"),
		cors		= require("cors"),
		path		= require("path");

// RPC Controller
const rpc = function( req, res, next ) {
	const Micro = require("./micro.js");

	res.setHeader("content-type", "application/json");

	let okay = function( msg ) { 
		res.json(JSON.stringify({ 
			status: 200, 
			result:msg 
		})); 
		next(); 
	}

	let fail = function( msg ) { 
		res.json(JSON.stringify({
			status: 500,
			result: msg
		})); 
		next(); 
	}

	let body 	= req.body;
	let cmd 	= body.cmd;

	if( cmd ) {
		let m = new Micro( body, okay, fail );
		if( ! m[cmd] ) {
			fail( `Command does not exist: ${cmd}` );
			return;
		}
		m[cmd]();
	} else {
		fail( "No command given" );
	}
}

// APP
const app 	= express();
const port	= 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('frontend'))

app.get( "/", (req, res) => {
	res.sendFile( path.join( __dirname + "/frontend/index.html" ) );
	res.end();
});

app.post( "*", rpc );

app.listen( port, function() {
	console.log(`Listening on port ${port}`);
});


module.exports = app;