var ResizeTool = function(canvas) {

    let _canvas = canvas;
    let _shape = undefined;
    let _shapeOrigin = undefined;
    let _origin = undefined;
    let _dragDirection = undefined;

    let createDragHandle = (x, y, width, height, cursor, dragDirection) => {
        var handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        handle.setAttribute("x", x);
        handle.setAttribute("y", y);
        handle.setAttribute("width", width);
        handle.setAttribute("height", height);
        handle.classList.add("handle");
        handle.classList.add(cursor);
        handle.dragDirection = dragDirection;

        svg.appendChild(handle);
    }

    let mouseMove = event => {
        _shapeOrigin = _shapeOrigin || {
            x: Number(_shape.getAttribute("x")),
            y: Number(_shape.getAttribute("y")),
            width: Number(_shape.getAttribute("width")),
            height: Number(_shape.getAttribute("height"))
        };
        _origin = _origin || event;

        let deltaX = event.offsetX - _origin.offsetX;
        let deltaY = event.offsetY - _origin.offsetY;

        if (_dragDirection.indexOf("w") > -1) {
            _shape.setAttribute("x",  deltaX < _shapeOrigin.width ? _shapeOrigin.x + deltaX : _shapeOrigin.x + _shapeOrigin.width);
            _shape.setAttribute("width", Math.abs(_shapeOrigin.width - deltaX));
        }

        if (_dragDirection.indexOf("e") > -1) {
            _shape.setAttribute("x", _shapeOrigin.width + deltaX > 0 ? _shapeOrigin.x : _shapeOrigin.x + _shapeOrigin.width + deltaX);
            _shape.setAttribute("width", Math.abs(_shapeOrigin.width + deltaX));
        }

        if (_dragDirection.indexOf("n") > -1) {
            _shape.setAttribute("y",  deltaY < _shapeOrigin.height ? _shapeOrigin.y + deltaY : _shapeOrigin.y + _shapeOrigin.height);
            _shape.setAttribute("height", Math.abs(_shapeOrigin.height - deltaY));
        }

        if (_dragDirection.indexOf("s") > -1) {
            _shape.setAttribute("y", _shapeOrigin.height + deltaY > 0 ? _shapeOrigin.y : _shapeOrigin.y + _shapeOrigin.height + deltaY);
            _shape.setAttribute("height", Math.abs(_shapeOrigin.height + deltaY));
        }
    }

    let mouseUp = () => {
        _shape = undefined;
        _shapeOrigin = undefined;
        _origin = undefined;
        _dragDirection = undefined;
        this.reset();
        this.onComplete();
    }

    this.onComplete = () => { }

    this.init = () => {
        this.reset();

        let activeShape = _canvas.querySelector(".shape.active");

        if (!activeShape) {
            return;
        }
        
        let dragHandlePadding = 8;
        let x = Number(activeShape.getAttribute("x"));
        let y = Number(activeShape.getAttribute("y"));
        let width = Number(activeShape.getAttribute("width"));
        let height = Number(activeShape.getAttribute("height"));

        createDragHandle(
            x - dragHandlePadding,
            y - dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            "nswe-resize",
            "nw"
        );

        createDragHandle(
            x + dragHandlePadding + 1,
            y - dragHandlePadding,
            width - dragHandlePadding - dragHandlePadding - 2,
            dragHandlePadding + dragHandlePadding,
            "ns-resize",
            "n"
        );

        createDragHandle(
            x + width - dragHandlePadding,
            y - dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            "nesw-resize",
            "ne"
        );

        createDragHandle(
            x + width - dragHandlePadding,
            y + 1 + dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            height - dragHandlePadding - dragHandlePadding - 2,
            "ew-resize",
            "e"
        );

        createDragHandle(
            x + width - dragHandlePadding,
            y + height - dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            "nswe-resize",
            "se"
        );

        createDragHandle(
            x + dragHandlePadding + 1,
            y + height - dragHandlePadding,
            width - dragHandlePadding - dragHandlePadding - 2,
            dragHandlePadding + dragHandlePadding,
            "ns-resize",
            "s"
        );

        createDragHandle(
            x - dragHandlePadding,
            y + height - dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            "nesw-resize",
            "sw"
        );

        createDragHandle(
            x - dragHandlePadding,
            y + 1 + dragHandlePadding,
            dragHandlePadding + dragHandlePadding,
            height - dragHandlePadding - dragHandlePadding - 2,
            "ew-resize",
            "w"
        );
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

        // The user clicked the left mouse on a handle
        if (!event.target.classList.contains("handle")) {
            return false;
        }

        _shape = _canvas.querySelector(".shape.active");
        _dragDirection = event.target.dragDirection;

        _canvas.addEventListener("mousemove", mouseMove);
        _canvas.addEventListener("mouseup", mouseUp);
    }
    
    this.reset = () => {
        _canvas.removeEventListener("mousemove", mouseMove);
        _canvas.removeEventListener("mouseup", mouseUp);
        _canvas.querySelectorAll(".handle").forEach(handle => handle.parentElement.removeChild(handle));
    }
    
    this.destroy = () => {
        this.reset();
    }
}