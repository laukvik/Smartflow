import {Scope,SCOPES} from '../Scope';

describe('Scope', () => {

  describe('parseScope', () => {
    it('should find global', () => {
      let s = new Scope();
      let v = s.parseScope("{global:selectedMovie}");
      expect(v.scope).toBe(SCOPES.GLOBAL);
      expect(v.value).toBe("selectedMovie");
    });
    it('should find global', () => {
      let s = new Scope();
      let v = s.parseScope("{selectedMovie}");
      expect(v.scope).toBe(SCOPES.VIEW);
      expect(v.value).toBe("selectedMovie");
    });
    it('should find none', () => {
      let s = new Scope();
      let v = s.parseScope("selectedMovie");
      expect(v.scope).toBe(SCOPES.NONE);
      expect(v.value).toBe("selectedMovie");
    });
  });

});
