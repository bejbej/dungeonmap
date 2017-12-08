var ToolManager = function (element) {
    let _canvas = element;
    let _activeShape = undefined;
    let _currentTool = undefined;
    let _tools = [];

    let handleEvent = event => {
        if (_currentTool) {
            return;
        }

        let i = 0;
        for (; i < _tools.length; ++i) {
            if (_tools[i].invoke(event, _canvas)) {
                break;
            }
        }

        if (i < _tools.length) {
            _currentTool = _tools[i];
            // remove event listeners
        }
    }

    let resetState = () => {
        _currentTool = undefined;
        _tools.forEach(tool => tool.init());
        // add event listeners
    }

    this.setTools = tools => {
        _tools.forEach(tool => tool.destroy());
        _tools = tools.map(tool => new tool(_canvas));
        _tools.forEach(tool => tool.onComplete = resetState);
        _tools.forEach(tool => tool.init());
    }

    _canvas.addEventListener("mousedown", handleEvent);
    _canvas.addEventListener("keypress", handleEvent);
}