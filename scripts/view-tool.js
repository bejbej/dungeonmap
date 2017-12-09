var ViewTool = function(canvas) {

    let _canvas = canvas;
    let _arbiter = new Arbiter();
    
    this.on = _arbiter.register;

    this.init = () => {
        _canvas.classList.add("view");
        _canvas.querySelectorAll(".shape").forEach(shape => shape.classList.add("pointer"));
    }

    this.invoke = event => {
        // The user clicked the mouse
        if (event.type !== "mousedown") {
            return false;
        }

        // The user clicked the left mouse
        if (event.button !== 0) {
            return false;
        }

        // The user clicked the left mouse on a shape
        if (!event.target.classList.contains("shape")) {
            return false;
        }

        event.target.classList.toggle("invisible");

        window.setTimeout(() => _arbiter.broadcast("complete"));
        window.setTimeout(() => _arbiter.broadcast("canvas-changed"));

        return true;
    }

    this.reset = () => { }

    this.destroy = () => {
        _canvas.classList.remove("view");
        _canvas.querySelectorAll(".shape").forEach(shape => shape.classList.remove("pointer"));
    }
}