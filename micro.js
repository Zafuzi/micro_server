module.exports = class Micro {
	constructor( data, okay, fail ) {
		this.data 	= data;
		this.okay 	= okay;
		this.fail 	= fail;
	}
	log() {
		console.log( this.data?.msg || "no message" );
		this.okay();
	}
	ping() {
		var self = this;
		const https = require('https');
		https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (resp) => {
		  let data = '';

		  // A chunk of data has been received.
		  resp.on('data', (chunk) => {
		    data += chunk;
		  });

		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
		    self.okay(JSON.parse(data).explanation);
		  });

		}).on("error", (err) => {
			self.fail("Error: " + err.message);
		});
	}
}
