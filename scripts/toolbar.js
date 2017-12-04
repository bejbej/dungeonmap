var Toolbar = function (element) {
    let toolbar = element;
    let callbacks = {};

    let setToolAsActive = (element, toolFunc) => {
        toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
        element.classList.add("active");
        toolFunc();
    }

    let addActionListener = id => {
        toolbar.querySelector("#" + id).addEventListener("click", event => {
            let callback = callbacks[id];
            if (callback !== undefined) {
                callback();
            }
        });
    }

    let addToolChangeListener = id => {
        toolbar.querySelector("#" + id).addEventListener("click", event => {
            toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
            event.target.classList.add("active");
            let callback = callbacks[id];
            if (callback !== undefined) {
                callback();
            }
        });
    }

    this.on = (key, func) => {
        callbacks[key] = func;
    }

    this.reset = () => {
        toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
        toolbar.querySelector("#select").classList.add("active");
        let callback = callbacks["select"];
        if (callback !== undefined) {
            callback();
        }
    }

    addActionListener("show-menu");
    addToolChangeListener("select");
    addToolChangeListener("draw");
    addToolChangeListener("view");
};