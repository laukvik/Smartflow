import {Collections} from '../Collections';
import {Data} from './Data';

let rows = Data.getMoviesRows();
let keyset = Data.getMoviesKeys();

describe('Collections', function () {

  describe('filters', function () {

    it('should find by equals in number array', function () {
      let c = new Collections({});
      c.addAny("genres", ["Drama", "Action"]);
      expect(c.find(rows).length).toBe(7);
    });

    it('should find by equals in array', function () {
      let c = new Collections({});
      c.addContains("genres", "Action");
      expect(c.find(rows).length).toBe(7);
    });

    it('should find by equals in number array', function () {
      let c = new Collections({});
      c.addContains("ratings", 5);
      expect(c.find(rows).length).toBe(7);
    });

    it('should find by greater than filter', function () {
      let c = new Collections({});
      c.addGreaterThan("imdbRating", 9.4);
      expect(c.find(rows).length).toBe(1);
    });

    it('should find by less than filter', function () {
      let c = new Collections({});
      c.addLessThan("imdbRating", 5);
      expect(c.find(rows).length).toBe(11);
    });

    it('should find by equals filter', function () {
      let c = new Collections({});
      c.addEquals("year", "2017");
      expect(c.find(rows).length).toBe(16);
    });

    it('should find by contains filter', function () {
      let c = new Collections({});
      c.addContains("title", "Logan");
      expect(c.find(rows).length).toBe(1);
    });

    it('should find by startsWith filter', function () {
      let c = new Collections({});
      c.addStartsWith("title", "T");
      expect(c.find(rows).length).toBe(8);
    });

    it('should find by two filters', function () {
      let c = new Collections({});
      c.addEquals("year", "2017");
      c.addStartsWith("title", "T");
      expect(c.find(rows).length).toBe(4);
    });

  });

});

