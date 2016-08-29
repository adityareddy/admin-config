import View from './View';

class Section extends View {
    constructor(name) {
        super(name);
        this._type = 'Section';
        this._fragments = [];
    }

    /*
     * Supports various syntax
     * fragments([ Fragment1, Fragment2 ])
     * fragments(Fragment1, Fragment2)
     * fragments([Fragment1, {Fragment2, Fragment3}])
     * fragments(Fragment1, {Fragment2, Fragment3})
     * fragments({Fragment2, Fragment3})
     */
    fragments() {
        if (!arguments.length) return this._fragments;

        [].slice.call(arguments).map(function(argument) {
            View.flatten(argument).map(arg => this.addFragment(arg));
        }, this);

        return this;
    }

    hasFragments() {
        return this.fragments.length > 0;
    }

    removeFragments() {
        this._fragments = [];
        return this;
    }

    getFragments() {
        return this._fragments;
    }

    getFragment(fragmentName) {
        return this._fragments.filter(p => p.name() === fragmentName)[0];
    }

    getFragmentsOfType(type) {
        return this._fragments.filter(p => p.type() === type);
    }

    addFragment(fragment) {
        if (fragment.order() === null) {
            fragment.order(this._fragments.length, true);
        }
        this._fragments.push(fragment);
        this._fragments = this._fragments.sort((a, b) => (a.order() - b.order()));

        return this;
    }
}

export default Section;
