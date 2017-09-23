import {Collections} from '../Collections';
import {Data} from './Data';

let rows = Data.getMoviesRows();
let keyset = Data.getMoviesKeys();

describe('Collections', function () {

  describe('keys', function () {

    it('should find by equals filter', function () {
      let c = new Collections({});
      c.addEquals("1927");
      expect(c.find(keyset).length).toBe(16);
    });

  });

  describe('rowset', function () {

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

