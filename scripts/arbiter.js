var Arbiter = function() {

    let _callbacks = { };

    this.register = (key, func) => _callbacks[key] = func;

    this.broadcast = key => {
        let func = _callbacks[key];

        if (func) {
            func();
        }
    }
}