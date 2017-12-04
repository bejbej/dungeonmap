var Menu = function () {
    let menu = document.getElementById("menu");
    let callbacks = {};

    let addEventListener = (type, id) => {
        menu.querySelector("#" + id).addEventListener(type, event => {
            let callback = callbacks[id];
            if (callback !== undefined) {
                callback();
            }
        });
    }

    this.on = (key, func) => {
        callbacks[key] = func;
    }

    this.show = () => {
        menu.classList.remove("hidden");
        menu.querySelector("#image-url").value = document.getElementById("img").getAttribute("src");
    }

    this.hide = () => {
        menu.classList.add("hidden")
    }

    this.getImageUrl = () => {
        return menu.querySelector("#image-url").value;
    }

    addEventListener("change", "image-url");
    addEventListener("click", "new");
    menu.querySelector("#hide-menu").addEventListener("click", this.hide);
}