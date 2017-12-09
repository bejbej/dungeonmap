var DeleteTool = function(canvas) {

    let _canvas = canvas;
    let _arbiter = new Arbiter();

    this.on = _arbiter.register;

    this.init = () => { }

    this.invoke = event => {
        // The user pressed a button
        if (event.type !== "keydown") {
            return false;
        }

        // The user pressed the delete or the backspace button
        if (event.keyCode !== 8 && event.keyCode !== 46) {
            return false;
        }

        // There is an active shape to delete
        let shape = _canvas.querySelector(".shape.active");
        if (shape === undefined) {
            return false;
        }

        shape.parentElement.removeChild(shape);

        window.setTimeout(() => _arbiter.broadcast("complete"));
        window.setTimeout(() => _arbiter.broadcast("canvas-changed"));

        return true;
    }

    this.reset = () => { }
    this.destroy = () => { }
}