import Field from "./Field";

class ImageField extends Field {
    constructor(name) {
        super(name);
        this._type = "image";
        this._options = {
        };
    }

    options(options) {
        if (!arguments.length) return this._options;
        this._options = options;
        return this;
    }
}

export default ImageField;
