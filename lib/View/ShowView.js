import View from './View';
import Menu from '../Menu/Menu';

class ShowView extends View {
    constructor(name) {
        super(name);
        this._type = 'ShowView';
        this._viewGroups = [];
        this._menu = null;
    }
    
    /**
     * Getter/Setter for the show view menu
     *
     * If the getter is called first, it will return a menu based on entities.
     *
     *     application.addEntity(new Entity('posts'));
     *     application.addEntity(new Entity('comments'));
     *     application.menu(); // Menu { children: [ Menu { title: "Posts" }, Menu { title: "Comments" } ]}
     *
     * If the setter is called first, all subsequent calls to the getter will return the set menu.
     *
     *     application.addEntity(new Entity('posts'));
     *     application.addEntity(new Entity('comments'));
     *     application.menu(new Menu().addChild(new Menu().title('Foo')));
     *     application.menu(); // Menu { children: [ Menu { title: "Foo" } ]}
     *
     * @see Menu
     */
    menu(menu) {
        if (!arguments.length) {
            if (!this._menu) {
                this._menu = new Menu();
            }
            return this._menu
        }

        this._menu = menu;
        return this;
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
