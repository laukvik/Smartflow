import {BadgeShape, BadgeStyle, Button, ButtonSize, ButtonStyle, Outline} from '../Button';

describe('Button', function () {

  describe('render', function () {

    it('should render all properties', function () {
      let b = new Button({});
      b.setLabel("Notifications");
      b.setEnabled(false);
      b.setButtonStyle(ButtonStyle.PRIMARY);
      b.setBadge("4");
      b.setBadgeStyle(BadgeStyle.LIGHT);
      b.setBadgeShape(BadgeShape.ROUND);
      b.setActive(true);
      b.setSize(ButtonSize.LARGE);
      expect(b.render().outerHTML).toBe(
        '<button class="btn btn-lg btn-primary active" role="button" disabled="true" aria-pressed="true"><span>Notifications</span> <span class="badge badge-light badge-pill">4</span></button>'
      );
    });

    it('should render outline', function () {
      let b = new Button({});
      b.setLabel("Notifications");
      b.setOutline(Outline.DANGER);
      expect(b.render().outerHTML).toBe(
        '<button class="btn btn-outline-danger" role="button"><span>Notifications</span> </button>'
      );
    });

    it('should render simple button', function () {
      let b = new Button({});
      b.setLabel("Notifications");
      expect(b.render().outerHTML).toBe(
        '<button class="btn" role="button"><span>Notifications</span> </button>'
      );
    });

  });

});

