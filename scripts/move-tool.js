var MoveTool = function(canvas) {

    let _canvas = canvas;
    let _arbiter = new Arbiter();
    let _shape = undefined;
    let _origin = undefined;

    let mouseMove = event => {
        _shape.setAttribute("x", Number(_shape.getAttribute("x")) + event.offsetX - _origin.offsetX);
        _shape.setAttribute("y", Number(_shape.getAttribute("y")) + event.offsetY - _origin.offsetY);
        _origin = event;
    }

    let mouseUp = event => {
        _shape = undefined;
        _origin = undefined;
        this.reset();
        _arbiter.broadcast("complete");
        _arbiter.broadcast("canvas-changed");
    }

    this.on = _arbiter.register;

    this.init = () => {
        _canvas.querySelectorAll(".shape").forEach(shape => shape.classList.add("move"));
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

        _shape = event.target;
        _origin = event;

        _canvas.addEventListener("mousemove", mouseMove);
        _canvas.addEventListener("mouseup", mouseUp);

        return true;
    }

    this.reset = () => {
        _canvas.removeEventListener("mousemove", mouseMove);
        _canvas.removeEventListener("mouseup", mouseUp);
    }

    this.destroy = () => {
        this.reset();
        _canvas.querySelectorAll(".shape").forEach(shape => shape.classList.remove("move"));
    }
}