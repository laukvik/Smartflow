var Smartflow = require("./smartflow");

describe('Smartflow', function () {

        it('language', function () {
            var app = new Smartflow();
            app.setLanguage("no");
            expect(app.getLanguage()).toBe("no");
        });
        it('login', function () {
            var app = new Smartflow();
            app.setLogin("john");
            expect(app.getLogin()).toBe("john");
        });

});
