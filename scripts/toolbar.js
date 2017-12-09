var Toolbar = function (element) {
    
    let toolbar = element;
    let _arbiter = new Arbiter();

    let setToolAsActive = (element, toolFunc) => {
        toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
        element.classList.add("active");
        toolFunc();
    }

    let addActionListener = id => {
        toolbar.querySelector("#" + id).addEventListener("click", event => {
            _arbiter.broadcast(id);
        });
    }

    let addToolChangeListener = id => {
        toolbar.querySelector("#" + id).addEventListener("click", event => {
            toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
            event.target.classList.add("active");
            _arbiter.broadcast(id);
        });
    }

    this.on = _arbiter.register;

    this.reset = () => {
        toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
        toolbar.querySelector("#select").classList.add("active");
        _arbiter.broadcast("select");
        
    }

    addActionListener("show-menu");
    addToolChangeListener("select");
    addToolChangeListener("draw");
    addToolChangeListener("view");
};