var Canvas = function (element) {
    let canvas = element;
    let svg = canvas.querySelector("#svg");
    let image = canvas.querySelector("#img");
    let closeCurrentTool = () => { };
    let callbacks = {};

    let drawShape = () => {
        var origin = undefined;
        var shape = undefined;

        var mouseDown = event => {
            origin = {
                offsetX: event.offsetX,
                offsetY: event.offsetY
            };

            canvas.removeEventListener("mousedown", mouseDown);
            canvas.addEventListener("mousemove", mouseMove);
            canvas.addEventListener("mouseup", mouseUp);
        }

        var mouseMove = event => {
            if (shape === undefined) {
                shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                shape.classList.add("shape");
                svg.appendChild(shape);
            }

            shape.setAttribute("x", origin.offsetX < event.offsetX ? origin.offsetX : event.offsetX);
            shape.setAttribute("y", origin.offsetY < event.offsetY ? origin.offsetY : event.offsetY);
            shape.setAttribute("height", Math.abs(event.offsetY - origin.offsetY));
            shape.setAttribute("width", Math.abs(event.offsetX - origin.offsetX));
        }

        var mouseUp = () => {
            origin = undefined;
            shape = undefined;
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
            canvas.addEventListener("mousedown", mouseDown);

            let callback = callbacks["shapes"];
            if (callback) {
                callback();
            }
        }

        canvas.classList.add("crosshair");
        canvas.addEventListener("mousedown", mouseDown);

        return () => {
            canvas.classList.remove("crosshair");
            canvas.removeEventListener("mousedown", mouseDown);
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
        }
    }

    let selectShape = () => {
        let shapes = svg.querySelectorAll(".shape")
        var origin = undefined;
        var shape = undefined;
        var hideDragHandles = undefined;

        var selectShape = () => {
            shape.classList.add("active");
            document.addEventListener("keydown", keyDown);
        }

        var unselectShape = () => {
            if (shape !== undefined) {
                shape.classList.remove("active");
            }
            if (hideDragHandles !== undefined) {
                hideDragHandles();
                hideDragHandles = undefined;
            }
            document.removeEventListener("keydown", keyDown);
            shape = undefined;
        }

        var selectShape = event => {
            event.stopImmediatePropagation();
            unselectShape();

            shape = event.target;
            origin = event;
            shape.classList.add("active");
            
            shapes.forEach(shape => shape.removeEventListener("mousedown", selectShape));
            canvas.addEventListener("mousemove", mouseMove);
            canvas.addEventListener("mouseup", mouseUp);
            document.addEventListener("keydown", keyDown);
        }

        var mouseMove = event => {
            shape.setAttribute("x", Number(shape.getAttribute("x")) + event.offsetX - origin.offsetX);
            shape.setAttribute("y", Number(shape.getAttribute("y")) + event.offsetY - origin.offsetY);
            origin = event;
        }

        var mouseUp = () => {
            origin = undefined;
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
            shapes.forEach(shape => shape.addEventListener("mousedown", selectShape));
            hideDragHandles = resizeShape(shape);

            let callback = callbacks["shapes"];
            if (callback) {
                callback();
            }
        }

        var keyDown = event => {
            if (event.keyCode === 8 || event.keyCode === 46) {
                svg.removeChild(shape);
                unselectShape();

                let callback = callbacks["shapes"];
                if (callback) {
                    callback();
                }
            }
        }

        canvas.addEventListener("mousedown", unselectShape);
        shapes.forEach(shape => shape.classList.add("move"));
        shapes.forEach(shape => shape.addEventListener("mousedown", selectShape));

        return () => {
            shapes.forEach(shape => shape.removeEventListener("mousedown", selectShape));
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
            unselectShape();
            
            shapes.forEach(shape => shape.classList.remove("move"));
        }
    }

    let resizeShape = (shape) => {
        var shape = shape;
        var dragHandlePadding = 8;
        var dragHandles = [];
        var origin = undefined;
        var shapeOrigin = undefined;
        var dragStrategy = undefined;

        var createDragHandle = (x, y, width, height, cursor, dragStrategy) => {
            var handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            handle.setAttribute("x", x);
            handle.setAttribute("y", y);
            handle.setAttribute("width", width);
            handle.setAttribute("height", height);
            handle.classList.add("handle");
            handle.classList.add(cursor);
            handle.dragStrategy = dragStrategy;

            handle.addEventListener("mousedown", mouseDown);

            dragHandles.push(handle);
            svg.appendChild(handle);
        }

        var createDragHandles = () => {
            var x = Number(shape.getAttribute("x"));
            var y = Number(shape.getAttribute("y"));
            var width = Number(shape.getAttribute("width"));
            var height = Number(shape.getAttribute("height"));

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

        var deleteDragHandles = () => {
            dragHandles.forEach(handle => svg.removeChild(handle));
            dragHandles = [];
        }

        var mouseDown = event => {
            event.stopImmediatePropagation();
            dragStrategy = event.target.dragStrategy;

            deleteDragHandles();

            canvas.addEventListener("mousemove", mouseMove);
            canvas.addEventListener("mouseup", mouseUp);
        }

        var mouseMove = event => {
            shapeOrigin = shapeOrigin || {
                x: Number(shape.getAttribute("x")),
                y: Number(shape.getAttribute("y")),
                width: Number(shape.getAttribute("width")),
                height: Number(shape.getAttribute("height"))
            };
            origin = origin || event;

            let deltaX = event.offsetX - origin.offsetX;
            let deltaY = event.offsetY - origin.offsetY;

            if (dragStrategy.indexOf("w") > -1) {
                shape.setAttribute("x",  deltaX < shapeOrigin.width ? shapeOrigin.x + deltaX : shapeOrigin.x + shapeOrigin.width);
                shape.setAttribute("width", Math.abs(shapeOrigin.width - deltaX));
            }

            if (dragStrategy.indexOf("e") > -1) {
                shape.setAttribute("x", shapeOrigin.width + deltaX > 0 ? shapeOrigin.x : shapeOrigin.x + shapeOrigin.width + deltaX);
                shape.setAttribute("width", Math.abs(shapeOrigin.width + deltaX));
            }

            if (dragStrategy.indexOf("n") > -1) {
                shape.setAttribute("y",  deltaY < shapeOrigin.height ? shapeOrigin.y + deltaY : shapeOrigin.y + shapeOrigin.height);
                shape.setAttribute("height", Math.abs(shapeOrigin.height - deltaY));
            }

            if (dragStrategy.indexOf("s") > -1) {
                shape.setAttribute("y", shapeOrigin.height + deltaY > 0 ? shapeOrigin.y : shapeOrigin.y + shapeOrigin.height + deltaY);
                shape.setAttribute("height", Math.abs(shapeOrigin.height + deltaY));
            }
        }

        var mouseUp = event => {
            shapeOrigin = undefined;
            origin = undefined;
            createDragHandles();
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);

            let callback = callbacks["shapes"];
            if (callback) {
                callback();
            }
        }

        createDragHandles();

        return () => {
            deleteDragHandles();
        }
    }

    let viewShapes = () => {
        let shapes = svg.querySelectorAll("rect")

        let toggleVisibility = event => {
            event.target.classList.toggle("invisible");

            let callback = callbacks["shapes"];
            if (callback) {
                callback();
            }
        }

        svg.classList.add("view");
        shapes.forEach(shape => shape.addEventListener("click", toggleVisibility));
        shapes.forEach(shape => shape.classList.add("pointer"));

        return () => {
            svg.classList.remove("view");
            shapes.forEach(shape => shape.removeEventListener("click", toggleVisibility));
            shapes.forEach(shape => shape.classList.remove("pointer"));
        };
    }

    this.on = (key, func) => {
        callbacks[key] = func;
    }

    this.startDrawing = () => {
        closeCurrentTool();
        closeCurrentTool = drawShape();
    }

    this.startSelecting = () => {
        closeCurrentTool();
        closeCurrentTool = selectShape();
    }

    this.startViewing = () => {
        closeCurrentTool();
        closeCurrentTool = viewShapes();
    }

    this.getData = () => {
        let data = {
            imageUrl: image.getAttribute("src"),
            shapes: []
        };

        let shapes = svg.querySelectorAll(".shape");
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
        closeCurrentTool();
        closeCurrentTool = () => { };
        this.setImageUrl("");
        this.setShapes([]);
    }

    this.setImageUrl = (imageUrl) => {
        image.setAttribute("src", imageUrl);

        let callback = callbacks["shapes"];
        if (callback) {
            callback();
        }
    }

    this.setShapes = (shapes) => {
        closeCurrentTool();
        closeCurrentTool = () => { };
        svg.querySelectorAll(".shape").forEach(shape => svg.removeChild(shape));

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

            svg.appendChild(shape);
        });

        let callback = callbacks["shapes"];
        if (callback) {
            callback();
        }
    }

    image.addEventListener("load", () => {
        let callback = callbacks["load"];
        if (callback) {
            callback();
        }
    });
}