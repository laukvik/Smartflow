import {Scope,SCOPES} from '../Scope';

describe('Scope', () => {

  describe('parseScope', () => {
    it('should find params', () => {
      let s = new Scope();
      let v = s.parseScope("{global:selectedMovie}");
      expect(v.scope).toBe(SCOPES.GLOBAL);
      expect(v.value).toBe("selectedMovie");
    });
  });

});
