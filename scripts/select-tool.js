var SelectTool = function(canvas) {

    let _canvas = canvas;

    this.onComplete = () => { }

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

        // The user clicked the left mouse on a shape
        if (!event.target.classList.contains("shape")) {
            return false;
        }

        _canvas.querySelectorAll(".shape.active").forEach(shape => shape.classList.remove("active"));
        event.target.classList.add("active");

        //window.setTimeout(() => this.onComplete());

        return false;
    }

    this.reset = () => {
    }

    this.destroy = () => {

    }
}