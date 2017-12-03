import {Layout} from './Layout';

describe('properties', function () {

  describe('parseGridLayout', function () {

    it('should be set', function () {
      const css = Layout.parseGridLayout({
        "sm": 2,
        "md": 3
      });
      expect(css).toBe("col-sm-2 col-md-3");
    });
  });

  describe('setting class', function () {

    it('should be set', function () {
      let btn = new Layout({});
      let node = btn.buildComponent({}, {"class":"luring"});
      expect(node.getAttribute("class")).toBe("sf-layout container luring");
    });

    it('should be null when not specified', function () {
      let btn = new Layout({});
      let node = btn.buildComponent({}, {});
      expect(node.getAttribute("class")).toBe("sf-layout container");
    });

  });

});

