let templates = {
    login: null,
    loginButton: null,
    logoutButton: null,
    register: null,
    sid: null
};

let SID;

const main = document.querySelector("main");
const PAGE_LOAD_DELAY = 50;

/**
 * @summary Immediately before the page is unloaded, set the opacity to 0
 */
window.onbeforeunload = function()
{
    document.querySelectorAll(".page").forEach(p =>
    {
        p.style.display = "none";
    });
    
    main.style.transition = "unset";
    main.style.opacity = "0";
}

document.addEventListener("DOMContentLoaded", () =>
{
    Object.keys(templates).forEach(function(k)
    {
        templates[k] = sleepless.rplc8(`r8[name='${k}']`);
    });

    sleepless.rpc(API, {cmd: "ping"}, function(r)
    {
        console.log(r);
    }, console.error);

    let qd = sleepless.getQueryData();
    if(!qd["page"])
    {
        sleepless.jmp("/?page=home");
    }
    sleepless.Nav(qd, data =>
    {
        SID = localStorage.getItem("sid");
        if(SID)
        {
            templates.loginButton.update([]);
            templates.logoutButton.update([{sid: SID}]);
        }
        else
        {
            templates.loginButton.update([{sid: SID}]);
            templates.logoutButton.update([]);
        }
        
        document.querySelectorAll(".page").forEach(p =>
        {
            p.style.display = "none";
        });

        // wait until opacity setting above is done local.css defines as 300ms
        setTimeout(function()
        {
            document.querySelectorAll(".page").forEach(p =>
            {
                p.style.display = "none";
                if(p.id === "page_" + data["page"])
                {
                    p.style.display = "";
                }
            });
            
            const activeRouteAnchor = document.querySelector(`[href="/?page=${data["page"]}"]`);
            if(activeRouteAnchor)
            {
                activeRouteAnchor.classList.add("active");
            }

            document.body.scrollIntoView();

            let func = window[`nav_${data["page"]}`];
            const fadeInDocument = function()
            {
                main.style.transition = `opacity ${PAGE_LOAD_DELAY}ms linear`;
                main.style.opacity = "1";
            }
            
            if(typeof(func) === "function")
            {
                func(fadeInDocument, data);
            }
            else
            {
                console.error(`nav_${data["page"]} is not a function`);
                nav_fail(fadeInDocument, data);
            }

        }, PAGE_LOAD_DELAY);
    });
});

function nav_home(cb)
{
    templates.sid.update([{sid: SID || null}]);
    cb();
}

function nav_logout(cb, data)
{
    localStorage.removeItem("sid");
    sleepless.rpc(API, {cmd: "logout", msg: data, sid: SID}, console.log, console.error);
    sleepless.jmp("/?page=home");
}

function nav_login(cb, data)
{
    templates.login.update([{error: sleepless.o2j(data?.error) || ""}], function(e)
    {
        e.addEventListener("submit", function(event)
        {
            event.preventDefault();
            let data = event.target.getData();
            sleepless.rpc(API, {
                cmd: "login",
                msg: data
            }, function(r)
            {
                if(r)
                {
                    localStorage.setItem("sid", r);
                }
                sleepless.jmp(`/?page=home`);
            }, function(err)
            {
                sleepless.jmp(`/?page=login&error=${sleepless.o2j(err)}`);
            });
        });
    });
    cb();
}

function nav_register(cb, data)
{
    templates.register.update([{error: sleepless.o2j(data?.error) || ""}], function(e)
    {
        e.addEventListener("submit", function(event)
        {
            event.preventDefault();
            let data = event.target.getData();
            sleepless.rpc(API, {
                cmd: "register",
                msg: data
            }, function(r)
            {
                if(r)
                {
                    localStorage.setItem("sid", r);
                }
                sleepless.jmp(`/?page=home`);
            }, function(err)
            {
                sleepless.jmp(`/?page=register&error=${sleepless.o2j(err)}`);
            });
        });
    });
    cb();
}

function nav_fail(cb)
{
    console.error("nav_fail");
    nav_home(cb);
}