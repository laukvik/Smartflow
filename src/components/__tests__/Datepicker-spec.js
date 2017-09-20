import {Datepicker} from '../Datepicker';

describe('datepicker', function () {

  describe('setting id', function () {

    it('should be set', function () {
      let btn = new Datepicker({});
      let node = btn.buildComponent({}, {"id":"luring"});
      expect(node.getAttribute("id")).toBe("luring");
    });

    it('should be null when not specified', function () {
      let btn = new Datepicker({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("id")).toBeNull();
    });

  });

  describe('setting class', function () {

    it('should be set', function () {
      let btn = new Datepicker({});
      let node = btn.buildComponent({}, {"class":"luring"});
      expect(node.getAttribute("class")).toBe("sf-datepicker luring");
    });

    it('should be null when not specified', function () {
      let btn = new Datepicker({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("class")).toBe("sf-datepicker");
    });

  });

  describe('find dates', function () {

    it('should find dates in september', function () {
      expect(Datepicker.getDate(0,0,8,2017,true).getDate()).toBe(28);
      expect(Datepicker.getDate(0,1,8,2017,true).getDate()).toBe(4);
      expect(Datepicker.getDate(0,2,8,2017,true).getDate()).toBe(11);
      expect(Datepicker.getDate(0,3,8,2017,true).getDate()).toBe(18);
      expect(Datepicker.getDate(0,4,8,2017,true).getDate()).toBe(25);
      expect(Datepicker.getDate(0,5,8,2017,true).getDate()).toBe(2);
    });

    it('should find dates in october', function () {
      expect(Datepicker.getDate(0,0,9,2017,true).getDate()).toBe(25);
      expect(Datepicker.getDate(0,1,9,2017,true).getDate()).toBe(2);
      expect(Datepicker.getDate(0,2,9,2017,true).getDate()).toBe(9);
      expect(Datepicker.getDate(0,3,9,2017,true).getDate()).toBe(16);
      expect(Datepicker.getDate(0,4,9,2017,true).getDate()).toBe(23);
      expect(Datepicker.getDate(0,5,9,2017,true).getDate()).toBe(30);
    });

  });

});

