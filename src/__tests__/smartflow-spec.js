var Smartflow = require('../smartflow');


function EmptyAction(){
}

function TimeAction(){
  this.smartflow = {
    "path": "/time",
    "states": {
      "format": "hh:mm"
    }
  }
}

var conf = {
  "TimeAction" : "/api/time"
};

describe('Application', function() {

  describe('configuration', function() {
    it('should not find when no config is loaded', function() {
      var app = new Smartflow();
      expect(app.getRequestUrl(new TimeAction())).toBeUndefined();
    });
    it('should not find undefined action', function() {
      var app = new Smartflow();
      app.setConfig(conf);
      expect(app.getRequestUrl()).toBeUndefined();
    });
    it('should not find non existing config', function() {
      var app = new Smartflow();
      expect(app.getRequestUrl(new EmptyAction())).toBeUndefined();
    });
    it('should find config', function() {
      var app = new Smartflow();
      app.setConfig(conf);
      expect(app.getConfig()).toBe(conf);
    });
    it('should find request url for an action', function() {
      var app = new Smartflow();
      app.setConfig(conf);
      expect(app.getRequestUrl(new TimeAction())).toBe('/api/time');
    });
  });

  describe('locale', function() {
    it('default locale should be undefined', function() {
      var app = new Smartflow();
      expect(app.getDefaultLocale()).toBeUndefined();
    });
    it('should set default locale', function() {
      var app = new Smartflow();
      expect(app.setDefaultLocale('no')).toBeUndefined();
      expect(app.getDefaultLocale()).toBe('no');
    });
    it('should set locale', function() {
      var app = new Smartflow();
      expect(app.setLocale('no')).toBeUndefined();
      expect(app.getLocale()).toBe('no');
    });
    it('should find closest locale', function() {
      var app = new Smartflow();
      app.loadLanguage('en', {});
      app.loadLanguage('us', {});
      app.loadLanguage('no', {});
      expect(app.findClosestLocale(['dk', 'se', 'nb-NO', 'no'])).toBe('no');
    });
    it('should find closest locale', function() {
      var app = new Smartflow();
      app.loadLanguage('nb-NO', {});
      app.loadLanguage('nn-NO', {});
      app.loadLanguage('no', {});
      expect(app.findClosestLocale(['nn-NO'])).toBe('nn-NO');
    });
  });

});

function ValidView() {
  this.smartflow = {
    "path": "/login"
  };
}

function NoPathView() {
  this.smartflow = {
  };
}
function NoSmartflowView() {
}

describe('View', function() {
  describe('validation', function() {
    it('should accept valid', function() {
      var app = new Smartflow();
      expect(app.isView(new ValidView())).toBe(true);
    });
    it('should fail missing path', function() {
      var app = new Smartflow();
      expect(app.isView(new NoPathView())).toBe(false);
    });
    it('should fail missing smartflow', function() {
      var app = new Smartflow();
      expect(app.isView(new NoSmartflowView())).toBe(false);
    });
  });

  it('should not add undefined', function() {
    var app = new Smartflow();
    expect(app.addView()).toBe(false);
  });

  it('should not find invalid view name', function() {
    var app = new Smartflow();
    expect(app.findView()).toBeUndefined();
    expect(app.findView({})).toBeUndefined();
    expect(app.findView(125)).toBeUndefined();
    expect(app.findView(function(){})).toBeUndefined();
  });

  it('should not find non exising view', function() {
    var app = new Smartflow();
    expect(app.findView('ValidViews')).toBeUndefined();
  });

  it('should find existing view', function() {
    var app = new Smartflow();
    var view = new ValidView();
    app.addView(view);
    expect(app.findView('ValidViews')).toBeUndefined();
    expect(app.findView('ValidView')).toBe(view);
  });

  it('should add valid view', function() {
    var app = new Smartflow();
    expect(app.addView(new ValidView())).toBe(true);
  });

  it('should fail to add a view multiple times', function() {
    var app = new Smartflow();
    expect(app.addView(new ValidView())).toBe(true);
    expect(app.addView(new ValidView())).toBe(false);
  });

  it('should remove existing view', function() {
    var app = new Smartflow();
    expect(app.addView(new ValidView())).toBe(true);
    expect(app.removeView(new ValidView())).toBe(true);
  });

});

describe('Actions', function() {
  it('should detect invalid action', function() {
    var app = new Smartflow();
    expect(app.isAction()).toBe(false);
  });
  it('should find valid action', function() {
    var app = new Smartflow();
    expect(app.isAction(new TimeAction())).toBe(true);
  });

  it('should not run invalid action', function() {
    var app = new Smartflow();
    expect(app.runAction()).toBe(false);
  });
  it('should not run action without caller', function() {
    var app = new Smartflow();
    expect(app.runAction(new TimeAction())).toBe(false);
  });
  it('should not run action with invalid caller', function() {
    var app = new Smartflow();
    expect(app.runAction(new TimeAction(), "")).toBe(false);
  });
  // it('should run client action', function() {
  //
  //   function ClientView() {
  //     this.smartflow = {
  //       "path": "/login"
  //     };
  //     this.viewInitialized = function (formatter) {
  //       this.runAction(new ClientAction());
  //     }
  //   }
  //
  //   function ClientAction() {
  //     this.smartflow = {
  //       "path": "/login"
  //     };
  //   }
  //
  //   var app = new Smartflow();
  //   app.addView(new ClientView());
  //   app.runAction(new ClientAction(), function () {
  //     expect(app.runAciton('confirm')).toBe('Are you sure?');
  //   });
  //   //expect(app.runAciton('confirm')).toBe('Are you sure?');
  //
  // });
});

describe('Path', function() {
  it('should set valid path', function() {
    var app = new Smartflow();
    app.addView(new ValidView());
    expect(app.setPath('/login')).toBe(true);
  });
  it('should not set invalid path', function() {
    var app = new Smartflow();
    app.addView(new ValidView());
    expect(app.setPath('/nonsense')).toBe(false);
  });
});

describe('State', function() {



});

var lang = {
  "confirm": "Are you sure?",
  "confirmIndex": "Delete {0} or {1}?",
  "confirmJson": "Delete {filename} for {filesize}?",
};

describe('Formatter', function() {
  it('should format without parameters', function() {

    var app = new Smartflow();
    app.loadLanguage("no", lang);
    app.setLocale("no");
    expect(app.format('confirm')).toBe('Are you sure?');

  });
  it('should format with indexed parameters', function() {

    var app = new Smartflow();
    app.loadLanguage("no", lang);
    app.setLocale("no");
    expect(app.format('confirmIndex', ['hello.txt', 'hello.doc'])).toBe('Delete hello.txt or hello.doc?');

  });

  // it('should format with named parameters', function() {
  //
  //   var app = new Smartflow();
  //   app.loadLanguage("no", lang);
  //   app.setLocale("no");
  //   expect(app.format('confirmJson', {"filename": "hello.txt", "filesize": "150"})).toBe('Delete hello.txt for 150?');
  //
  // });

});

