import {Path} from '../src/Path';

describe('Path', () => {

  let config  = "/category/{category}/{id}";

  describe('matches', () => {
    it('should match', () => {
      let p = new Path(config);
      expect(p.matches("/category/89/33")).toBe(true);
      expect(p.matches("/category/89/33/")).toBe(true);
    });
    it('should not match', () => {
      let p = new Path(config);
      expect(p.matches("/category/89/")).toBe(false);
      expect(p.matches("/category/")).toBe(false);
      expect(p.matches("/category")).toBe(false);
      expect(p.matches("/")).toBe(false);
    });
  });

  describe('parse', () => {
    it('should find params', () => {
      let p = new Path(config);
      let params = p.parse("/category/89/33");
      expect(params.category).toBe("89");
      expect(params.id).toBe("33");
    });
  });

  describe('getVariable', () => {
    it('should find variable', () => {
      expect(Path.getVariable("{category}")).toBe("category");
    });
  });

  describe('_parse', () => {
    it('should find params', () => {
      // let config  = "/category/{category}/{id}";
      expect(Path._parse(config)[0]).toBe("/");
      expect(Path._parse(config)[1]).toBe("category");
      expect(Path._parse(config)[2]).toBe("{category}");
      expect(Path._parse(config)[3]).toBe("{id}");
    });
    it('should correct params', () => {
      let config2  = "/category/{category}/{id}/";
      expect(Path._parse(config2)[0]).toBe("/");
      expect(Path._parse(config2)[1]).toBe("category");
      expect(Path._parse(config2)[2]).toBe("{category}");
      expect(Path._parse(config2)[3]).toBe("{id}");
      expect(Path._parse(config2).length).toBe(4);
    });
  });

  describe('getLength', () => {
    it('should find params', () => {
      let p = new Path(config);
      expect(p.getLength()).toBe(4);
    });
  });

});
