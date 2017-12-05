var File = function () {

    let characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/";

    let intToRadix = value => {
        if (value === 0) {
            return "0";
        }

        let residual = Math.floor(value);
        let result = "";

        while (residual !== 0) {
            let digit = residual % 64;
            result = characters.charAt(digit) + result;
            residual = Math.floor(residual / 64);
        }
        
        return result;
    }
    
    let radixToInt = value => {
        let result = 0;
        let digits = value.split("");
        for (let i = 0; i < digits.length; ++i) {
            result = (result * 64) + characters.indexOf(digits[i]);
        }
        return result;
    }

    let v1 = hash => {
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

    let v2 = hash => {
        hash = hash.slice(2);
        let imageUrl = /^([^\\]|\\\\)*/.exec(hash)[0];
        hash = hash.slice(imageUrl.length + 1);
        imageUrl = imageUrl.replace(/\\\\/g, "\\");
        let data = hash.split("\\");
        let shapeMask = radixToInt(data[0]).toString(2);
        let shapes = [];

        let j = shapeMask.length;
        for (var i = 1; i < data.length; i = i + 4) {
            shapes.push({
                x: radixToInt(data[i]),
                y: radixToInt(data[i+1]),
                width: radixToInt(data[i+2]),
                height: radixToInt(data[i+3]),
                isVisible: shapeMask[--j] === "1"
            });
        }

        return {
            imageUrl: imageUrl,
            shapes: shapes
        };
    }

    this.loadFromHash = () => {
        let hash = location.hash.slice(1);

        if (/^1_/.test(hash)) {
            return v1(hash);
        }

        if (/^2\\/.test(hash)) {
            return v2(hash);
        }

        return null;
    }

    this.saveToHash = (data) => {
        let binary = data.shapes.map(shape => shape.isVisible ? "1" : "0").reverse().join("");
        let shapeMask = intToRadix(parseInt(binary.length > 0 ? binary : "0", 2));
        let shapes = data.shapes.map(shape => {
            return "\\" + intToRadix(shape.x) + "\\" + intToRadix(shape.y) + "\\" + intToRadix(shape.width) + "\\" + intToRadix(shape.height);
        }).join("");
        let hash = "2\\" + data.imageUrl.replace(/\\/, "\\\\") + "\\" + shapeMask + shapes;

        history.replaceState(null, null, document.location.pathname + '#' + hash);
    }
}