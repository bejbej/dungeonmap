app.toolbar = new function () {
    let toolbar = document.getElementById("toolbar");

    let setToolAsActive = (element, toolFunc) => {
        toolbar.querySelectorAll("button.active").forEach(button => button.classList.remove("active"));
        element.classList.add("active");
        toolFunc();
    }

    toolbar.querySelector("#show-menu").addEventListener("click", () => app.menu.show());
    toolbar.querySelector("#select").addEventListener("click", event => setToolAsActive(event.target, app.canvas.startSelecting));
    toolbar.querySelector("#create").addEventListener("click", event => setToolAsActive(event.target, app.canvas.startDrawing));
    toolbar.querySelector("#view").addEventListener("click", event => setToolAsActive(event.target, app.canvas.startViewing));

    this.reset = () => {
        setToolAsActive(toolbar.querySelector("#select"), app.canvas.startSelecting);
    }
};