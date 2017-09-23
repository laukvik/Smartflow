import {Collections} from '../Collections';



describe('Collections', function () {

  describe('extract', function () {

    it('should fail', function () {
      let c = new Collections({});
      c.find();

      let items = [
        {}
      ];

      expect(c.filter(items)).toBeUndefined();
    });

  });

});

