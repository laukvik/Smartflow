import {Textfield, TextfieldType} from './Textfield';

describe('textfield', function () {

  describe('render', function () {

    it('should render all props', function () {
      let t = new Textfield();
      t.setLabel("Sallary");
      t.setBefore("USD");
      t.setAfter(".00");
      t.setPlaceholder("Amount");
      t.setValidationMessage("Sorry, thats not enough sallary!");
      t.setError("Sorry, thats not enough sallary!");
      t.setHelp("Enter your desired sallary.");
      t.setTextfieldType(TextfieldType.NUMBER);

      expect(t.buildComponent().outerHTML).toBe(
        '<div class="form-group">' +
          '<label>Sallary</label>' +
          '<div class="input-group">' +
            '<span class="input-group-addon">USD</span>' +
            '<input class="form-control" placeholder="Amount" type="number">' +
            '<span class="input-group-addon">.00</span>' +
          '</div>' +
          '<div class="form-control-feedback" style="display: block;">Sorry, thats not enough sallary!</div>' +
          '<small class="form-text text-muted" style="display: block;">Enter your desired sallary.</small>' +
        '</div>'
      );
    });

  });

});

