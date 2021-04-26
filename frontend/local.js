document.addEventListener("DOMContentLoaded", dcl => {
	sleepless.globalize();
	init();
})

function init() {
	rpc({cmd: "ping"}, console.log, console.error);

	let o = {cmd: "log", msg: "Hello World!" }
	rpc( o, console.log, console.error );
	showAlert( "info", o.msg );
}