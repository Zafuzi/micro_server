const rpc = function( o, okay ) {
	fetch("/", {
		method:"POST",
		headers: {
			"Content-Type": "application/json"
		}, 
		body: JSON.stringify(o)
	})
	.then(res => {
		return res.json();
	})
	.then(json => {
		try {
			json = JSON.parse( json );
			okay( json );
		} catch(err) {
			console.error( "response was not an object", o.cmd );
		}
	})
}

let o = {cmd: "log", msg: "Hello World" }
rpc( o, res => {console.log(res); });

o = {cmd: "ping" }
rpc( o, res => {console.log(res); });
