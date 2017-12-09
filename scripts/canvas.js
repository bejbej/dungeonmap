var Canvas = function (element) {

    let _canvas = element;
    let _svg = _canvas.querySelector("#svg");
    let _image = _canvas.querySelector("#img");
    let _arbiter = new Arbiter();

    this.on = _arbiter.register;

    this.getData = () => {
        let data = {
            imageUrl: _image.getAttribute("src"),
            shapes: []
        };

        let shapes = _svg.querySelectorAll(".shape");
        shapes.forEach(shape => { 
            data.shapes.push({ 
                tagName: shape.tagName, 
                x: shape.getAttribute("x"), 
                y: shape.getAttribute("y"), 
                width: shape.getAttribute("width"), 
                height: shape.getAttribute("height"), 
                isVisible: shape.className.baseVal.indexOf("invisible") === -1 
            }); 
        });

        return data;
    }

    this.reset = () => {
        this.setImageUrl("");
        this.setShapes([]);
    }

    this.setImageUrl = (imageUrl) => {
        _image.setAttribute("src", imageUrl);
        _arbiter.broadcast("image");
    }

    this.setShapes = (shapes) => {
        _svg.querySelectorAll(".shape").forEach(shape => _svg.removeChild(shape));

        shapes.forEach(savedShape => {
            let shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shape.classList.add("shape");
            shape.setAttribute("x", savedShape.x);
            shape.setAttribute("y", savedShape.y);
            shape.setAttribute("width", savedShape.width); 
            shape.setAttribute("height", savedShape.height);

            if (!savedShape.isVisible) {
                shape.classList.add("invisible");
            }

            _svg.appendChild(shape);
        });
    }

    _image.addEventListener("load", () => _arbiter.broadcast("load"));
}