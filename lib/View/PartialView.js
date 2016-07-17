import View from './View';

class PartialView extends View {
    constructor(name) {
        super(name);
        this._type = 'PartialView';
    }
}

export default PartialView;
