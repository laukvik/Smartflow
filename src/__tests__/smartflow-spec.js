import Smartflow from '../smartflow';

let a = {}

describe('Application', function () {

  describe('action', function () {
    it('should be false when not an action', function () {
      var app = new Smartflow();
      app.setConfig(a);
      expect(app.getConfig()).toBe(a);
    });
  });
});

