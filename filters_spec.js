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
});