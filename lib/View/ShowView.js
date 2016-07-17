import View from './View';

class ShowView extends View {
    constructor(name) {
        super(name);
        this._type = 'ShowView';
        this._viewGroups = [];
    }

    /*
     * Supports various syntax
     * viewGroups([ ViewGroup1, ViewGroup2 ])
     * viewGroups(ViewGroup1, ViewGroup2)
     * viewGroups([ViewGroup1, {ViewGroup2, ViewGroup3}])
     * viewGroups(ViewGroup1, {ViewGroup2, ViewGroup3})
     * viewGroups({ViewGroup2, ViewGroup3})
     */
    viewGroups() {
        if (!arguments.length) return this._viewGroups;

        [].slice.call(arguments).map(function(argument) {
            View.flatten(argument).map(arg => this.addViewGroup(arg));
        }, this);

        return this;
    }

    hasViewGroups() {
        return this.viewGroups.length > 0;
    }

    removeViewGroups() {
        this._viewGroups = [];
        return this;
    }

    getViewGroups() {
        return this._viewGroups;
    }

    getViewGroup(viewGroupName) {
        return this._viewGroups.filter(p => p.name() === viewGroupName)[0];
    }

    getViewGroupsOfType(type) {
        return this._viewGroups.filter(p => p.type() === type);
    }

    addViewGroup(viewGroup) {
        if (viewGroup.order() === null) {
            viewGroup.order(this._viewGroups.length, true);
        }
        this._viewGroups.push(viewGroup);
        this._viewGroups = this._viewGroups.sort((a, b) => (a.order() - b.order()));

        return this;
    }
}

export default ShowView;
