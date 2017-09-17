import {Table} from '../Table';

describe('properties', function () {

  describe('setting id', function () {

    it('should be set', function () {
      let btn = new Table({});
      let node = btn.buildComponent({}, {"id":"luring"});
      expect(node.getAttribute("id")).toBe("luring");
    });

    it('should be null when not specified', function () {
      let btn = new Table({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("id")).toBeNull();
    });

  });

  describe('setting class', function () {

    it('should be set', function () {
      let btn = new Table({});
      let node = btn.buildComponent({}, {"class":"luring"});
      expect(node.getAttribute("class")).toBe("sf-table luring");
    });

    it('should be null when not specified', function () {
      let btn = new Table({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("class")).toBe("sf-table");
    });

  });

});

