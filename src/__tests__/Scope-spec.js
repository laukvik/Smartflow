import {Scope,SCOPES} from '../Scope';

describe('Scope', () => {

  describe('findScopes', () => {
    it('should find all scopes', () => {
      let scopes = Scope.findScopes("/category/{global:selectedMovie}/{id}");
      expect(scopes.length).toBe(2);
      let s1 = scopes[0];
      expect(s1.scope).toBe(SCOPES.GLOBAL);
      expect(s1.value).toBe("selectedMovie");
      let s2 = scopes[1];
      expect(s2.scope).toBe(SCOPES.VIEW);
      expect(s2.value).toBe("id");
    });

    it('should handle error', () => {
      let scopes = Scope.findScopes("/category/{{selectedMovie}");
      expect(scopes.length).toBe(1);
      console.info(scopes);
      let s1 = scopes[0];
      expect(s1.scope).toBe(SCOPES.VIEW);
      expect(s1.value).toBe("selectedMovie");
    });
  });

  describe('parseScope', () => {
    it('should find global', () => {
      let v = Scope.parseScope("{global:selectedMovie}");
      expect(v.scope).toBe(SCOPES.GLOBAL);
      expect(v.value).toBe("selectedMovie");
    });
    it('should find view', () => {
      let v = Scope.parseScope("{selectedMovie}");
      expect(v.scope).toBe(SCOPES.VIEW);
      expect(v.value).toBe("selectedMovie");
    });
    it('should find none', () => {
      let v = Scope.parseScope("selectedMovie");
      expect(v.scope).toBe(SCOPES.NONE);
      expect(v.value).toBe("selectedMovie");
    });
  });

});
