import {Formatter} from '../Formatter';

const FORMAT_PADDING = "YYYY.MM.DD";
const FORMAT_NO_PADDING = "YYYY.M.D";

function d(year, month, day){
  let date = new Date();
  date.setUTCFullYear(year);
  date.setUTCMonth(month-1);
  date.setUTCDate(day);
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}

describe('formatter', function () {

  describe('extract', function () {

    it('should fail', function () {
      let f = new Formatter({});
      expect(f._extract("2010-12-31", "a", "YYYY-MM-DD")).toBeUndefined();
    });

    it('should extract year', function () {
      let f = new Formatter({});
      expect(f._extract("2010-12-31", "YYYY", "YYYY-MM-DD")).toBe("2010");
    });

    it('should extract month', function () {
      let f = new Formatter({});
      expect(f._extract("2010-12-31", "MM", "YYYY-MM-DD")).toBe("12");
    });

    it('should extract date', function () {
      let f = new Formatter({});
      expect(f._extract("2010-12-31", "DD", "YYYY-MM-DD")).toBe("31");
    });

  });

  describe('parse', function () {

    it('should not parse', function () {
      let f = new Formatter({});
      expect(f.parse("", "YYYY.MM.DD")).toBeUndefined();
      expect(f.parse("2010.12.31", "")).toBeUndefined();
      expect(f.parse("", "")).toBeUndefined();
      expect(f.parse("aaa", "YYYY.MM.DD")).toBeUndefined();
    });

    it('should parse', function () {
      let f = new Formatter({});
      let d2 = d(2010,12,31);
      expect(f.parse("2010.12.31", "YYYY.MM.DD").getTime()).toBe(d2.getTime());
      expect(f.parse("2010-12-31", "YYYY-MM-DD").getTime()).toBe(d2.getTime());
      expect(f.parse("2010-31-12", "YYYY-DD-MM").getTime()).toBe(d2.getTime());
    });

  });

  describe('formatDate using padding', function () {

    it('should set month', function () {
      let f = new Formatter({});
      expect(f.formatDate(d(2010,10,5), FORMAT_PADDING)).toBe("2010.10.05");
    });

    it('should set day', function () {
      let f = new Formatter({});
      expect(f.formatDate(d(2010,5,5), FORMAT_PADDING)).toBe("2010.05.05");
    });

  });

  describe('formatDate without padding', function () {


    it('should set day', function () {
      let f = new Formatter({});
      expect(f.formatDate(d(2010,10,5), FORMAT_NO_PADDING)).toBe("2010.10.5");
    });

    it('should set month', function () {
      let f = new Formatter({});
      expect(f.formatDate(d(2010,5,5), FORMAT_NO_PADDING)).toBe("2010.5.5");
    });

  });

  describe('days', function () {

    it('should find monday', function () {
      let f = new Formatter({});
      f.setStartsWithMonday(true);
      expect(f.formatDay(0, true)).toBe("Mandag");
    });

    it('should find monday', function () {
      let f = new Formatter({});
      f.setStartsWithMonday(false);
      expect(f.formatDay(0, true)).toBe("Søndag");
    });

  });


  describe('formatDate', function () {

    it('should fail when string as value', function () {
      let f = new Formatter({});
      expect(f.formatDate("", "YYYY.MM.DD")).toBeUndefined();
    });

    it('should fail when null as value', function () {
      let f = new Formatter({});
      expect(f.formatDate(null, "YYYY.MM.DD")).toBeUndefined();
    });

    it('should fail when null as format', function () {
      let f = new Formatter({});
      expect(f.formatDate(d(2010,5,5), null)).toBeUndefined();
    });

    it('should fail when undefined as format', function () {
      let f = new Formatter({});
      expect(f.formatDate(d(2010,5,5), undefined)).toBeUndefined();
    });

  });


});

