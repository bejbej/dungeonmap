var File = function () {
    this.loadFromHash = () => {
        let hash = location.hash.slice(1);
        
        if (hash.length < 1) {
            hash = "1_Li9pbWFnZXMvbWFwLnBuZw==_46_141_124_199_1_169_216_74_123_1_167_142_88_73_1_252_155_64_49_1_285_70_150_88_1_262_202_78_113_1";
        }

        let data = hash.split("_");

        if (data.length === 1) {
            return null;
        }

        let version = data[0];
        let imageUrl = atob(data[1]);
        let shapes = [];
        for (var i = 2; i < data.length; i = i + 5) {
            shapes.push({
                x: data[i],
                y: data[i+1],
                width: data[i+2],
                height: data[i+3],
                isVisible: data[i+4] === "1"
            });
        }

        return {
            imageUrl: imageUrl,
            shapes: shapes
        };
    }

    this.saveToHash = (data) => {
        let shapes = data.shapes.map(shape => {
            return "_" + shape.x + "_" + shape.y + "_" + shape.width + "_" + shape.height + "_" + (shape.isVisible ? 1 : 0).toString();
        }).join("");
        let hash = "1_" + btoa(data.imageUrl) + shapes;

        history.replaceState(null, null, document.location.pathname + '#' + hash);
    }
}