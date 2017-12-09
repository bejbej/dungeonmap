var DrawRectangleTool = function(canvas) {

    let _canvas = canvas;
    let _arbiter = new Arbiter();
    let _shape = undefined;
    let _origin = undefined;

    let mouseMove = event => {
        if (_shape === undefined) {
            _shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            _shape.classList.add("shape");
            svg.appendChild(_shape);
        }

        _shape.setAttribute("x", _origin.offsetX < event.offsetX ? _origin.offsetX : event.offsetX);
        _shape.setAttribute("y", _origin.offsetY < event.offsetY ? _origin.offsetY : event.offsetY);
        _shape.setAttribute("height", Math.abs(event.offsetY - _origin.offsetY));
        _shape.setAttribute("width", Math.abs(event.offsetX - _origin.offsetX));
    }
    
    let mouseUp = () => {
        _shape = undefined;
        _origin = undefined;
        this.reset();
        _arbiter.broadcast("complete");
        _arbiter.broadcast("canvas-changed");
    }

    this.on = _arbiter.register;

    this.init = () => {
        _canvas.classList.add("crosshair");
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
        canvas.classList.remove("crosshair");
    }
}