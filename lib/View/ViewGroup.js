import View from './View';

class ViewGroup extends View {
    constructor(name) {
        super(name);
        this._type = 'ViewGroup';
        this._partialViews = [];
    }

    /*
     * Supports various syntax
     * partialViews([ PartialView1, PartialView2 ])
     * partialViews(PartialView1, PartialView2)
     * partialViews([PartialView1, {PartialView2, PartialView3}])
     * partialViews(PartialView1, {PartialView2, PartialView3})
     * partialViews({PartialView2, PartialView3})
     */
    partialViews() {
        if (!arguments.length) return this._partialViews;

        [].slice.call(arguments).map(function(argument) {
            View.flatten(argument).map(arg => this.addPartialView(arg));
        }, this);

        return this;
    }

    hasPartialViews() {
        return this.partialViews.length > 0;
    }

    removePartialViews() {
        this._partialViews = [];
        return this;
    }

    getPartialViews() {
        return this._partialViews;
    }

    getPartialView(partialViewName) {
        return this._partialViews.filter(p => p.name() === partialViewName)[0];
    }

    getPartialViewsOfType(type) {
        return this._partialViews.filter(p => p.type() === type);
    }

    addPartialView(partialView) {
        if (partialView.order() === null) {
            partialView.order(this._partialViews.length, true);
        }
        this._partialViews.push(partialView);
        this._partialViews = this._partialViews.sort((a, b) => (a.order() - b.order()));

        return this;
    }
}

export default ViewGroup;
