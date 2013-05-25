var filterService = {
    load: function () {
        return {
            "brand": ["ecco", "adidas"],
            "type": []
        };
    }
};

function Filter(service) {
    var data = [];
    var currentId = 0;
    var generateId = function () {
        currentId += 1;
        return currentId;
    };

    function Node(parent, value) {
        this.id = "id_" + generateId();
        this.value = value;
        this.parent = parent;
        this.children = [];
        this.selected = false;
    }

    (function () {
        var filters = service.load();
        for (var filter in filters) {
            if (!filters.hasOwnProperty(filter)) continue;
            var node = new Node(undefined, filter);
            for (var i = 0; i < filters[filter].length; i++) {
                node.children.push(new Node(node, filters[filter][i]));
            }
            data.push(node);
        }
    })();

    var listeners = [];
    this.attach = function (listener) {
        listeners.push(listener);
    };

    var notifyAll = function () {
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].call(undefined);
        }
    };

    var nodeById = function (id) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                return data[i];
            }
            for (var j = 0; j < data[i].children.length; j++) {
                if (data[i].children[j].id === id) {
                    return data[i].children[j];
                }
            }
        }
        return undefined;
    };

    this.select = function (id) {
        var node = nodeById(id);
        if (!node.parent) return;
        var siblings = node.parent.children;
        for (var i = 0; i < siblings.length; i++) {
            siblings[i].selected = false;
        }
        node.selected = true;
        notifyAll();
    };

    this.remove = function (parent_id){
        var children = nodeById(parent_id).children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].selected) {
                children[i].selected.splice(i, 1);
                break;
            }
        }
        notifyAll();
    };

    this.add = function (parent_id, value) {
        var node = nodeById(parent_id);
        node.children.push(new Node(node, value));
        notifyAll();
    };

    this.sort = function (parent_id) {
        var node = nodeById(parent_id);

        node.children.sort(function (a, b) {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });

        notifyAll();
    };
    this.move = function (parent_id) {
        var node = nodeById(parent_id);
        var index = data.indexOf(node);
        data.splice(index,1);
        data.push(node);
        notifyAll();
    };

    this.data = function () {
        return data;
    };
}

function FilterUI(model) {
    var id;
    var update = function () {
        if (!id) return;
        //TODO implement update
    };

    var select = function (node) {
        model.select(node);
    };

    model.attach(function () {
        update();
    });

    this.bind = function (d) {
        id = d;
        update();
    };
}

var controller = {
    init: function () {
        var filter = new Filter(filterService);
        var filterUI = new FilterUI(filter);
        filterUI.bind("accordion");

        //this is just a sample
        document.querySelector("id=move").attachEvent("onclick", function () {
            filter.move();
        });
    }
};
