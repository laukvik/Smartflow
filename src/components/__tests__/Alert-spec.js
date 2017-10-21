import {Alert} from '../Alert';

describe('properties', function () {

  describe('setting id', function () {

    it('should be set', function () {
      let btn = new Alert({"":""});
      let node = btn.buildComponent({}, {"id":"luring"});
      expect(node.getAttribute("id")).toBe("luring");
    });

    it('should be null when not specified', function () {
      let btn = new Alert({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("id")).toBeNull();
    });

  });

  describe('setting class', function () {

    it('should be set', function () {
      let btn = new Alert({});
      let node = btn.buildComponent({}, {"class":"luring"});
      expect(node.getAttribute("class")).toBe("sf-alert alert alert-danger luring");
    });

    it('should be null when not specified', function () {
      let btn = new Alert({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("class")).toBe("sf-alert alert alert-danger");
    });

  });

});

