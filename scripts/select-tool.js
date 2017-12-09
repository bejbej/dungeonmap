var SelectTool = function(canvas) {

    let _canvas = canvas;
    let _arbiter = new Arbiter();

    this.on = _arbiter.register;

    this.init = () => { }

    this.invoke = (event, canvas) => {
        // The user clicked the mouse
        if (event.type !== "mousedown") {
            return false;
        }

        // The user clicked the left mouse
        if (event.button !== 0) {
            return false;
        }

        _canvas.querySelectorAll(".shape.active").forEach(shape => shape.classList.remove("active"));

        if (event.target.classList.contains("shape")) {
            event.target.classList.add("active");
        }

        window.setTimeout(() => _arbiter.broadcast("complete"));

        // Return false because we don't want selecting a shape to block another tool from taking action.
        // For example selecting and moving a shape
        return false;
    }

    this.reset = () => {
    }

    this.destroy = () => {
        _canvas.querySelectorAll(".shape.active").forEach(shape => shape.classList.remove("active"));
    }
}