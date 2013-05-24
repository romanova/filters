var filterService = {
    load: function () {
        return {
            "brand": ["ecco", "adidas"],
            "type": []
        }
    }
};

function Filter(service) {
    var data = [];
    var nextId = function () {
        this.id = this.id ? this.id + 1 : 0;
    };

    function Node(parent, value) {
        this.id = "id_" + nextId();
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

    this.select = function (node) {
        if (!node.parent) return;
        var siblings = node.parent.children;
        for (var i = 0; i < siblings.length; i++) {
            siblings.selected = false;
        }
        node.selected = true;
    };

    this.remove = function () {
        //TODO implement removing
        notifyAll();
    };

    this.add = function (parent_id, value) {
        //TODO implement adding
        notifyAll();
    };

    this.sort = function () {
        //TODO implement sort
        notifyAll();
    };

    this.move = function () {
        //TODO implement move
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