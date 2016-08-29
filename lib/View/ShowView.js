import View from './View';
import Menu from '../Menu/Menu';

class ShowView extends View {
    constructor(name) {
        super(name);
        this._type = 'ShowView';
        this._sections = [];
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
     * sections([ Section1, Section2 ])
     * sections(Section1, Section2)
     * sections([Section1, {Section2, Section3}])
     * sections(Section1, {Section2, Section3})
     * sections({Section2, Section3})
     */
    sections() {
        if (!arguments.length) return this._sections;

        [].slice.call(arguments).map(function(argument) {
            View.flatten(argument).map(arg => this.addSection(arg));
        }, this);

        return this;
    }

    hasSections() {
        return this.sections.length > 0;
    }

    removeSections() {
        this._sections = [];
        return this;
    }

    getSections() {
        return this._sections;
    }

    getSection(sectionName) {
        return this._sections.filter(p => p.name() === sectionName)[0];
    }

    getSectionsOfType(type) {
        return this._sections.filter(p => p.type() === type);
    }

    addSection(section) {
        if (section.order() === null) {
            section.order(this._sections.length, true);
        }
        this._sections.push(section);
        this._sections = this._sections.sort((a, b) => (a.order() - b.order()));

        return this;
    }
}

export default ShowView;
