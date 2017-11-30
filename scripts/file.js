app.file = new function () {
    this.new = () => {
        app.canvas.reset();
        app.toolbar.reset();
    }

    this.open = () => {
        let image = document.getElementById("img");
        let canvas = document.getElementById("canvas");
        let fileInput = document.createElement("input");

        fileInput.setAttribute("type", "file");
        fileInput.style.display = "none";
        fileInput.addEventListener("change", event => {
            let file = event.target.files[0];
            let reader = new FileReader();

            reader.onload = event => {
                let data = JSON.parse(event.target.result);
                app.canvas.load(data);
            };

            reader.readAsText(file);
        }, false);
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    this.save = () => {
        let image = document.getElementById("img");
        let svg = document.getElementById("svg");
        let shapes = svg.querySelectorAll("rect");

        let saveFile = {};
        saveFile.imageUrl = image.getAttribute("src");
        saveFile.shapes = [];
        shapes.forEach(shape => {
            saveFile.shapes.push({
                tagName: shape.tagName,
                x: shape.getAttribute("x"),
                y: shape.getAttribute("y"),
                width: shape.getAttribute("width"),
                height: shape.getAttribute("height"),
                visible: shape.className.baseVal.indexOf("invisible") === -1
            });
        });
        
        let saveElement = document.createElement("a");
        saveElement.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(saveFile)));
        saveElement.setAttribute("download", "saveFile.json");
        saveElement.style.display = "none";
        document.body.appendChild(saveElement);
        saveElement.click();
        document.body.removeChild(saveElement);
    }

}