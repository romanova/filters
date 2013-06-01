var filterService = {
    load: function () {
        return {
            "Brand": ["ecco", "adidas"],
            "Type": ["one", "two"],
            "Testing": ["one", "two"]
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

    this.remove = function (parent_id) {
        var children = nodeById(parent_id).children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].selected) {
                children.splice(i, 1);
                notifyAll();
                break;
            }
        }
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
        data.splice(index, 1);
        data.push(node);
        notifyAll();
    };

    this.data = function () {
        return data;
    };
}

function Accordion(model) {
    var id, that = this;
    this.renderer = new (function () {
        this.accordion_template = "<div class='accordion' id='accordion'>{group_template}</div>";

        this.inner_template = "<li>{value}</li>";

        this.group_template = "<div class='accordion-group'>" +
            "<div class='accordion-heading'><a class='accordion-toggle' data-toggle='collapse'" +
            " data-parent='#accordion' href='#{id}'>" +
            "{value}" +
            "<i class='icon-chevron-down pull-right'></i>" +
            "</a>" +
            "</div>" +
            "<div id='{id}' class='accordion-body in collapse'>" +
            "<div class='accordion-inner'>" +
            "<ul class='innerAccordionNamesList'>" +
            "{inner_template}" +
            "</ul>" +
            "</div>" +
            "</div>" +
            "</div>";

        this.render = function () {
            var insert = function (template, name, value) {
                return template.replace("{" + name + "}", value);
            };
            var generateGroups = function (data) {
                var groups = "";
                var generateInners = function (children) {
                    var inners = "";
                    for (var i = 0; i < children.length; i++) {
                        inners += insert(that.renderer.inner_template, "value", children[i].value);
                    }
                    return inners;
                };
                for (var i = 0; i < data.length; i++) {
                    var group_content = insert(that.renderer.group_template, "value", data[i].value);
                    group_content = insert(group_content, "id", data[i].id);
                    group_content = insert(group_content, "id", data[i].id);
                    group_content = insert(group_content, "inner_template", generateInners(data[i].children));
                    groups += group_content;
                }
                return groups;
            };
            if (!id) {
                return;
            }
            $('#' + id).html(insert(this.accordion_template, "group_template", generateGroups(model.data())));
        };
    })();

    this.bind = function (_id) {
        id = _id;
        model.attach(function () {
            that.renderer.render();
        });
        this.renderer.render();
        this.controller.init();
    };

    this.controller = new (function () {
        var that = this;
        var data = model.data();
        this.init = function () {
            for (var i = 0; i < data.length; i++) {
                var element = $('#' + data[i].id);
                element.on('shown', function () {
                    that.selectedParent = this.id;
                });
                element.on('hidden', function () {
                    that.selectedParent = undefined;
                });
            }
        };
        this.selectedParent = undefined;
        this.selectedChild = undefined;
    });

}

var controller = {
    init: function () {
        var filters = new Filter(filterService);
        var accordion = new Accordion(filters);
        accordion.bind("filters");
        $("#sort").click(function() {
           filters.sort(accordion.controller.selectedParent);
        });
    }

};

$(document).ready(function () {
    controller.init();
    $('.collapse').collapse();
});