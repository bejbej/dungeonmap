app.canvas = new function () {
    let canvas = document.getElementById("canvas");
    let svg = canvas.querySelector("#svg");
    let image = canvas.querySelector("#img");
    let closeCurrentTool = () => { };

    let createShape = () => {
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
        }

        var keyDown = event => {
            if (event.keyCode === 8 || event.keyCode === 46) {
                svg.removeChild(shape);
                unselectShape();
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
                ["x", "y"]
            );

            createDragHandle(
                x + dragHandlePadding + 1,
                y - dragHandlePadding,
                width - dragHandlePadding - dragHandlePadding - 2,
                dragHandlePadding + dragHandlePadding,
                "ns-resize",
                ["y"]
            );

            createDragHandle(
                x + width - dragHandlePadding,
                y - dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                "nesw-resize",
                ["y", "width"]
            );

            createDragHandle(
                x + width - dragHandlePadding,
                y + 1 + dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                height - dragHandlePadding - dragHandlePadding - 2,
                "ew-resize",
                ["width"]
            );

            createDragHandle(
                x + width - dragHandlePadding,
                y + height - dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                "nswe-resize",
                ["width", "height"]
            );

            createDragHandle(
                x + dragHandlePadding + 1,
                y + height - dragHandlePadding,
                width - dragHandlePadding - dragHandlePadding - 2,
                dragHandlePadding + dragHandlePadding,
                "ns-resize",
                ["height"]
            );

            createDragHandle(
                x - dragHandlePadding,
                y + height - dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                "nesw-resize",
                ["x", "height"]
            );

            createDragHandle(
                x - dragHandlePadding,
                y + 1 + dragHandlePadding,
                dragHandlePadding + dragHandlePadding,
                height - dragHandlePadding - dragHandlePadding - 2,
                "ew-resize",
                ["x"]
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
            origin = origin || event;
            var x = Number(shape.getAttribute("x"));
            var y = Number(shape.getAttribute("y"));
            var width = Number(shape.getAttribute("width"));
            var height = Number(shape.getAttribute("height"));

            if (dragStrategy.indexOf("x") > -1) {
                x = x + event.offsetX - origin.offsetX;
                width = width - event.offsetX + origin.offsetX;
            }

            if (dragStrategy.indexOf("y") > -1) {
                y = y + event.offsetY - origin.offsetY;
                height = height - event.offsetY + origin.offsetY;
            }

            if (dragStrategy.indexOf("width") > -1) {
                width = width + event.offsetX - origin.offsetX;
            }

            if (dragStrategy.indexOf("height") > -1) {
                height = height + event.offsetY - origin.offsetY;
            }

            shape.setAttribute("x", x);
            shape.setAttribute("y", y);
            shape.setAttribute("width", width);
            shape.setAttribute("height", height);

            origin = event;
        }

        var mouseUp = event => {
            origin = undefined;
            createDragHandles();
            canvas.removeEventListener("mousemove", mouseMove);
            canvas.removeEventListener("mouseup", mouseUp);
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

    this.startDrawing = () => {
        closeCurrentTool();
        closeCurrentTool = createShape();
    }

    this.startSelecting = () => {
        closeCurrentTool();
        closeCurrentTool = selectShape();
    }

    this.startViewing = () => {
        closeCurrentTool();
        closeCurrentTool = viewShapes();
    }

    this.reset = () => {
        closeCurrentTool();
        closeCurrentTool = () => { };

        image.setAttribute("src", "");
        svg.querySelectorAll("rect").forEach(shape => svg.removeChild(shape));
    }

    this.load = (data) => {
        this.reset();
        
        image.setAttribute("src", data.imageUrl);

        data.shapes.forEach(savedShape => {
            let shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shape.classList.add("shape");
            shape.setAttribute("x", savedShape.x);
            shape.setAttribute("y", savedShape.y);
            shape.setAttribute("width", savedShape.width); 
            shape.setAttribute("height", savedShape.height);

            if (!savedShape.visible) {
                shape.classList.add("invisible");
            }

            svg.appendChild(shape);
        });

        app.toolbar.reset();
    }
}