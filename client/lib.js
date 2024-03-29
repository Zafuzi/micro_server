const API = "/server/";

let isAlertVisible = false;
let alertsToShow = [];

/**
 * Shows an alert on the page with a default of 3 second timeout
 * @param type - okay, info, warn, fail
 * @param message - some text to show
 * @param timeout - optional timeout in ms (default 3000)
 */
function showAlert( type, message, timeout ) {
    // only show one at a time for now
    // TODO increase to 3 and make them push down dynamically
    if( isAlertVisible ) {
        alertsToShow.push( {type, message, timeout} );
        return;
    } 
    let a = document.createElement("div");
        a.classList.add( "hid", "alert", "alert-"+type );
        a.innerHTML = message;
        a.addEventListener("click", function() {
            a.classList.remove('active');
            setTimeout( function() {
                if( a ) a.remove();
                isAlertVisible = false;
                runNextAlert();
            }, 300);
        });

    document.body.appendChild(a);
    isAlertVisible = true;

    a.classList.remove('hid'); 
    setTimeout( function() {
        a.classList.add('active');
        setTimeout( function() {
            a.classList.remove('active');
            setTimeout( function() {
                if( a ) a.remove();
                isAlertVisible = false;
                runNextAlert();
            }, 300);
        }, timeout || 3000);
    }, 300);
}

function runNextAlert() {
    if( alertsToShow.length === 0 ) return;
    let nextAlert = alertsToShow[0];
    showAlert( nextAlert.type, nextAlert.message, nextAlert.timeout );
    alertsToShow.splice(0, 1);
}

