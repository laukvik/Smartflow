import {Alert, AlertStyle} from './Alert';

describe('properties', function () {

  describe('render', function () {

    it('should use all properties', function () {
      let a = new Alert();
      a.setText("This is a primary alert—check it out!");
      a.setAlertStyle(AlertStyle.PRIMARY);
      a.setClosable(true);
      expect(a.render().outerHTML).toBe(
        '<div role="alert" class="alert alert-primary alert-dismissible"><span>This is a primary alert—check it out!</span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>'
      );
    });

  });


});

