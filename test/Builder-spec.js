import {Builder} from '../src/Builder';

describe('Builder', function () {

  describe('parseScope', function () {

    it('should find global scope', function () {
      let b = new Builder();
      expect(b.parseScope("{global:movies}").scope).toBe("GLOBAL");
    });

    it('should find view scope', function () {
      let b = new Builder();
      expect(b.parseScope("{movies}").scope).toBe("VIEW");
    });

    it('should find no scope', function () {
      let b = new Builder();
      expect(b.parseScope("movies").scope).toBe("NONE");
    });



    it('should find global value', function () {
      let b = new Builder();
      expect(b.parseScope("{global:movies}").value).toBe("movies");
    });

    it('should find view value', function () {
      let b = new Builder();
      expect(b.parseScope("{movies}").value).toBe("movies");
    });

    it('should find value', function () {
      let b = new Builder();
      expect(b.parseScope("movies").value).toBe("movies");
    });

  });

});

