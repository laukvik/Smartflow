import {Scope,SCOPES} from '../Scope';

describe('Scope', () => {

  describe('replace', () => {
    it('should replace all scopes', () => {
      let value = "/category/{global:selectedMovie}/{id}";
      let scopes = Scope.findScopes(value);
      let s1 = scopes[0];
      let s2 = scopes[1];

      let replaced = value;

      replaced = Scope.replace(s1, replaced, "Star Wars");
      expect(replaced).toBe("/category/Star Wars/{id}");

      replaced = Scope.replace(s2, replaced, "55");
      expect(replaced).toBe("/category/Star Wars/55");
    });

  });

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

    it('should handle incorrect syntax gracefully', () => {
      let scopes = Scope.findScopes("/category/{{selectedMovie}");
      expect(scopes.length).toBe(1);
      console.info(scopes);
      let s1 = scopes[0];
      expect(s1.scope).toBe(SCOPES.VIEW);
      expect(s1.value).toBe("selectedMovie");
    });

    it('should handle error1', () => {
      let scopes = Scope.findScopes("/category/selectedMovie}");
      expect(scopes.length).toBe(0);
    });

    it('should handle error2', () => {
      let scopes = Scope.findScopes("/category/{selectedMovie");
      expect(scopes.length).toBe(0);
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
