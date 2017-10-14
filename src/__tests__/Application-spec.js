import {Application} from '../Application';
import {View} from "../View";

describe('Application', () => {

  class CategoriesView extends View {
    constructor(){
      super();
      this.smartflow = {
        "path": "/category"
      }
    }
  }

  class CategoryView extends View {
    constructor(){
      super();
      this.smartflow = {
        "path": "/category/{category}"
      }
    }
  }

  class ItemView extends View {
    constructor(){
      super();
      this.smartflow = {
        "path": "/category/{category}/{id}"
      }
    }
  }

  let categoriesView = new CategoriesView();
  let categoryView = new CategoryView();
  let itemView = new ItemView();

  describe('findViewByPath', () => {
    it('should find correct view', () => {
      let app = new Application();
      app.addView(categoriesView);
      app.addView(categoryView);
      app.addView(itemView);
      expect(app.findViewByPath("/category")).toBe(categoriesView);
      expect(app.findViewByPath("/category/12")).toBe(categoryView);
      expect(app.findViewByPath("/category/12/33")).toBe(itemView);
    });
  });

  describe('setPath', () => {
    it('should set correct view', () => {
      let app = new Application();
      app.addView(categoriesView);
      app.addView(categoryView);
      app.addView(itemView);
      app.setPath("/category");
      expect(app.getView()).toBe(categoriesView);
      app.setPath("/category/12");
      expect(app.getView()).toBe(categoryView);
      app.setPath("/category/12/33");
      expect(app.getView()).toBe(itemView);
    });
  });

});
