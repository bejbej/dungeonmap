app.menu = new function () {
    let menu = document.getElementById("menu");

    menu.querySelector("#hide-menu").addEventListener("click", () => this.hide());

    menu.querySelector("#new").addEventListener("click", () => {
        app.file.new();
        this.hide();
    });

    menu.querySelector("#open").addEventListener("click", () => {
        app.file.open();
        this.hide();
    });
    
    menu.querySelector("#save").addEventListener("click", () => {
        app.file.save();
        this.hide();
    });

    menu.querySelector("#image-url").addEventListener("change", event => {
        document.getElementById("img").setAttribute("src", event.target.value);
    });

    this.show = () => {
        menu.classList.remove("hidden");
        menu.querySelector("#image-url").value = document.getElementById("img").getAttribute("src");
    }

    this.hide = () => {
        menu.classList.add("hidden");
    }
}