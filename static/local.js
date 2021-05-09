var templates = {
	login: null,
	register: null
}

document.addEventListener("DOMContentLoaded", dcl => {
	Object.keys(templates).forEach( function(k) {
		templates[k] = rplc8(`r8[name='${k}']`);
	});

	rpc(API, {cmd: "ping"}, function(r) {
		console.log(r);
	}, console.error);

	let qd = getQueryData();
	if( ! qd.page ) jmp("/?page=home");
	Nav(qd, data => {
		document.body.style.opacity = 0;

		// wait until opacity setting above is done local.css defines as 300ms
		setTimeout( function() {

			document.querySelectorAll(".page").forEach(p => {
				p.style.display = "none";
				if( p.id == "page_" + data.page ) {
					p.style.display = "";
				}
			});

			document.body.scrollIntoView()

			let func = window[`nav_${data.page}`];
			typeof(func) == "function" ? func(() => {
				document.body.style.opacity = 1;
			}, data) : console.error(`nav_${data.page} is not a function`);

		}, 300); // local.css body>transition>opacity 300ms
	});
});

function nav_home(cb) {
	cb();
}

function nav_login(cb) {
	templates.login.update([{ error: "" }], function(e, d, i) {
		e.addEventListener("submit", function(event) {
			event.preventDefault();
			let data = event.target.getData();
			console.log( data );
		});
	});
	cb();
}

function nav_register(cb) {
	templates.register.update([{ error: "" }], function(e, d, i) {
		e.addEventListener("submit", function(event) {
			event.preventDefault();
			let data = event.target.getData();
			console.log( data );
		});
	});
	cb();
}
