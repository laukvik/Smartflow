import {Button} from '../Button';

describe('properties', function () {

  describe('setting id', function () {

    it('should be set', function () {
      let btn = new Button({});
      let node = btn.buildComponent({}, {"id":"luring"});
      expect(node.getAttribute("id")).toBe("luring");
    });

    it('should be null when not specified', function () {
      let btn = new Button({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("id")).toBeNull();
    });

  });

  describe('setting class', function () {

    it('should be set', function () {
      let btn = new Button({});
      let node = btn.buildComponent({}, {"class":"luring"});
      expect(node.getAttribute("class")).toBe("btn btn-default luring");
    });

    it('should be null when not specified', function () {
      let btn = new Button({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("class")).toBe("btn btn-default");
    });

  });

});

