import ChoiceField from "./ChoiceField";

class RadioField extends ChoiceField {
    constructor(name) {
        super(name);
        this._type = "radio";
    }
}

export default RadioField;
