describe('A suite for filter model testing', function () {

    var filterService = {
        load: function () {
            return {
                "brand": ["ecco", "adidas"],
                "type": ["shoes", "boots"]
            };
        }
    };

    var filter;

    beforeEach(function () {
        filter = new Filter(filterService);
    });

    it('should create proper structure', function() {
        expect(filter.data().length).toBe(2);
    });
});