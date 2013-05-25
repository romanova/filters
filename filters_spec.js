describe('A suite for filter model testing', function () {

    var filterService = {
        load: function () {
            return {
                "brand": ["ecco", "tommy", "adidas"],
                "type": ["shoes", "boots"]
            };
        }
    };

    var filter;

    beforeEach(function () {
        filter = new Filter(filterService);
    });

    it('should create proper structure', function () {
        expect(filter.data().length).toBe(2);
        expect(filter.data()[0].parent).toBeUndefined();
        expect(filter.data()[0].children[0].parent).toBeDefined();
        expect(filter.data()[0].children[0].id).toBeDefined();
        expect(filter.data()[0].children[0].id).not.toBe(filter.data()[0].children[1].id);
    });

    it('should select a child', function () {

        var called = 0;
        runs(function () {
            filter.attach(function () {
                called += 1;
            });
            filter.select(filter.data()[0].children[0].id);
            filter.select(filter.data()[0].children[1].id);
        });

        waitsFor(function () {
            return called > 1;
        }, 'Listener should be called', 100);

        runs(function () {
            expect(filter.data()[0].children[0].selected).toBe(false);
            expect(filter.data()[0].children[1].selected).toBe(true);
        });
    });

    it('should remove a child', function () {

        var called = 0;
        var toBeRemoved;
        runs(function () {
            filter.attach(function () {
                called += 1;
            });
            toBeRemoved = filter.data()[0].children[0].id;
            filter.select(toBeRemoved);
            filter.remove(filter.data()[0].id);
        });

        waitsFor(function () {
            return called > 1;
        }, 'Listener should be called', 100);

        runs(function () {
            expect(filter.data()[0].children[0].id).not.toBe(toBeRemoved);
        });
    });

    it('should add a child', function () {

        var called = 0;
        var toBeAdded = "diesel";
        runs(function () {
            filter.attach(function () {
                called += 1;
            });
            filter.add(filter.data()[0].id, toBeAdded);
        });

        waitsFor(function () {
            return called > 0;
        }, 'Listener should be called', 100);

        runs(function () {
            var length = filter.data()[0].children.length;
            expect(filter.data()[0].children[length - 1].value).toBe(toBeAdded);
        });
    });

    it('should move a parent', function () {

        var called = 0;
        var toBeMoved;
        runs(function () {
            filter.attach(function () {
                called += 1;
            });
            toBeMoved = filter.data()[0].id;
            filter.move(toBeMoved);
        });

        waitsFor(function () {
            return called > 0;
        }, 'Listener should be called', 100);

        runs(function () {
            var length = filter.data().length;
            expect(filter.data()[length - 1].id).toBe(toBeMoved);
        });
    });

    it('should sort children', function () {

        var called = false;
        runs(function () {
            filter.attach(function () {
                called = true;
            });
            filter.sort(filter.data()[0].id);
        });

        waitsFor(function () {
            return called;
        }, 'Listener should be called', 100);

        runs(function () {
            expect(filter.data()[0].children[2].value).toEqual("tommy");
            expect(filter.data()[0].children[1].value).toEqual("ecco");
        });
    });
});