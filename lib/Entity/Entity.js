import stringUtils from "../Utils/stringUtils";
import Field from "../Field/Field";
import DashboardView from '../View/DashboardView';
import MenuView from '../View/MenuView';
import ListView from '../View/ListView';
import CreateView from '../View/CreateView';
import EditView from '../View/EditView';
import DeleteView from '../View/DeleteView';
import ShowView from '../View/ShowView';
import BatchDeleteView from '../View/BatchDeleteView';
import ExportView from '../View/ExportView';

var index = 0;

class Entity {
    constructor(name) {
        this._name = name;
        this._uniqueId = this._name + '_' + index++;
        this._baseApiUrl = null;
        this._label = null;
        this._identifierField = new Field("id");
        this._isReadOnly = false;
        this._errorMessage = null;
        this._order = 0;
        this._url = null;
        this._relatedEntities = [];
        this._transformations = [];
        this._createMethod = null; // manually set the HTTP-method for create operation, defaults to post
        this._updateMethod = null; // manually set the HTTP-method for update operation, defaults to put
        this._retrieveMethod = null; // manually set the HTTP-method for the get operation, defaults to get
        this._deleteMethod = null; // manually set the HTTP-method for the delete operation, defaults to delete


        this._initViews();
    }

    get uniqueId() {
        return this._uniqueId;
    }

    get views() {
        return this._views;
    }

    label() {
        if (arguments.length) {
            this._label = arguments[0];
            return this;
        }

        if (this._label === null) {
            return stringUtils.camelCase(this._name);
        }

        return this._label;
    }

    name() {
        if (arguments.length) {
            this._name = arguments[0];
            return this;
        }

        return this._name;
    }

    addTransformation(transformation) {
        if (!transformation) {
            throw new Error("No transformation provided");
        } else if(typeof transformation !== 'function') {
            throw new Error("Transformation is not a function");
        } else if(typeof transformation({}) !== 'object') {
            throw new Error("Transformation should return an object");
        }

        this._transformations.push(transformation);

        return this;
    }

    applyTransformations(restPayload) {
        if (!restPayload) {
            throw new Error("No payload provided");
        }
        var i = 0;
        function applyTransformationsRecursive(obj, arr) {
            i++;
            if (!arr[i-1]) return obj;
            return applyTransformationsRecursive(arr[i-1](obj), arr);
        }

        return applyTransformationsRecursive(restPayload, this._transformations);
    }


    addRelatedEntity(relatedEntity) {
        if (!relatedEntity) {
            throw new Error("No related entity given");
        }

        this._relatedEntities.push(relatedEntity);

        return this;
    }

    getRelatedEntity(relatedEntityName) {
        let foundEntity = this._relatedEntities.filter(e => e.name() === relatedEntityName)[0];
        if (!foundEntity) {
            throw new Error(`Unable to find related entity "${relatedEntityName}"`);
        }

        return foundEntity;
    }

    hasRelatedEntity(fieldName) {
        return !!(this._relatedEntities.filter(f => f.name() === fieldName).length);
    }

    menuView() {
        return this._views["MenuView"];
    }

    dashboardView() {
        return this._views["DashboardView"];
    }

    listView() {
        return this._views["ListView"];
    }

    creationView() {
        return this._views["CreateView"];
    }

    editionView() {
        return this._views["EditView"];
    }

    deletionView() {
        return this._views["DeleteView"];
    }

    batchDeleteView() {
        return this._views["BatchDeleteView"];
    }

    exportView() {
        return this._views["ExportView"];
    }

    showView() {
        return this._views["ShowView"];
    }

    baseApiUrl(baseApiUrl) {
        if (!arguments.length) return this._baseApiUrl;
        this._baseApiUrl = baseApiUrl;
        return this;
    }

    _initViews() {
        this._views = {
            "DashboardView": new DashboardView().setEntity(this),
            "MenuView": new MenuView().setEntity(this),
            "ListView": new ListView().setEntity(this),
            "CreateView": new CreateView().setEntity(this),
            "EditView": new EditView().setEntity(this),
            "DeleteView": new DeleteView().setEntity(this),
            "BatchDeleteView": new BatchDeleteView().setEntity(this),
            "ExportView": new ExportView().setEntity(this),
            "ShowView": new ShowView().setEntity(this)
        };
    }

    identifier(value) {
        if (!arguments.length) return this._identifierField;
        if (!(value instanceof Field)) {
            throw new Error('Entity ' + this.name() + ': identifier must be an instance of Field.');
        }
        this._identifierField = value;
        return this;
    }

    readOnly() {
        this._isReadOnly = true;

        this._views["CreateView"].disable();
        this._views["EditView"].disable();
        this._views["DeleteView"].disable();
        this._views["BatchDeleteView"].disable();

        return this;
    }

    get isReadOnly() {
        return this._isReadOnly;
    }

    getErrorMessage(response) {
        if (typeof (this._errorMessage) === 'function') {
            return this._errorMessage(response);
        }

        return this._errorMessage;
    }

    errorMessage(errorMessage) {
        if (!arguments.length) return this._errorMessage;
        this._errorMessage = errorMessage;
        return this;
    }

    order(order) {
        if (!arguments.length) return this._order;
        this._order = order;
        return this;
    }

    url(url) {
        if (!arguments.length) return this._url;
        this._url = url;
        return this;
    }

    getUrl(viewType, identifierValue, identifierName) {
        if (typeof (this._url) === 'function') {
            return this._url(this.name(), viewType, identifierValue, identifierName);
        }

        return this._url;
    }

    createMethod(createMethod) {
        if (!arguments.length) return this._createMethod;
        this._createMethod = createMethod;
        return this;
    }

    updateMethod(updateMethod) {
        if (!arguments.length) return this._updateMethod;
        this._updateMethod = updateMethod;
        return this;
    }

    retrieveMethod(retrieveMethod) {
        if (!arguments.length) return this._retrieveMethod;
        this._retrieveMethod = retrieveMethod;
        return this;
    }

    deleteMethod(deleteMethod) {
        if (!arguments.length) return this._deleteMethod;
        this._deleteMethod = deleteMethod;
        return this;
    }
}

export default Entity;
