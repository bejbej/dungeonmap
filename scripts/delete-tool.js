var DeleteTool = function(canvas) {

    let _canvas = canvas;

    this.onComplete = () => { }

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

        shape.parent.removeChild(shape);

        window.setTimeout(() => this.onComplete());

        return true;
    }

    this.reset = () => { }
    this.destroy = () => { }
}