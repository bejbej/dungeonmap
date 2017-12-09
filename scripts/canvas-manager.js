var CanvasManager = function (element) {

    let _canvas = element;
    let _arbiter = new Arbiter();
    let _activeShape = undefined;
    let _tools = [];

    let handleEvent = event => {
        let i = 0;
        for (; i < _tools.length; ++i) {
            if (_tools[i].invoke(event, _canvas)) {
                break;
            }
        }

        if (i < _tools.length) {
            _activeTool = _tools[i];
            _canvas.removeEventListener("mousedown", handleEvent);
            document.removeEventListener("keydown", handleEvent);
        }
    }

    let resetState = () => {
        _activeTool = undefined;
        _tools.forEach(tool => tool.init());
        _canvas.addEventListener("mousedown", handleEvent);
        document.addEventListener("keydown", handleEvent);
    }

    this.setTools = tools => {
        _tools.forEach(tool => tool.destroy());
        _tools = tools.map(tool => new tool(_canvas));
        _tools.forEach(tool => {
            tool.on("complete", resetState);
            tool.on("canvas-changed", () => _arbiter.broadcast("canvas-changed"));
            tool.init();
        });
    }

    this.on = _arbiter.register;

    resetState();
}