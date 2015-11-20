describe('settings', function() {

  beforeEach(module('WatchTimer'));

  var settings;

  beforeEach(
    inject(function(_settings_) {
      settings = _settings_;
    })
  );

  describe('set and get settings', function() {

    it('should set and get correctly', function() {
      expect(settings.get('freeTestKey')).toBe('foo');
      settings.set('freeTestKey', 'bar');
      expect(settings.get('freeTestKey')).toBe('bar');
    });

    it('should reset all settings', function() {
      settings.set('freeTestKey', 'bar');
      expect(settings.get('freeTestKey')).toBe('bar');
      settings.resetAll();
      expect(settings.get('freeTestKey')).toBe('foo');
    });

    it('should error on settings that are not expected', function() {
      var setFoo = function() {
        settings.set('unknownTestKey', 'bar');
      };

      expect(setFoo).toThrow('unknown setting \'unknownTestKey\'');
    });

  });

  describe('save and restore', function() {
    it('should save', function() {
      // change default setting and save
      settings.set('freeTestKey', 'bar');
      expect(settings.get('freeTestKey')).toBe('bar');
      settings.save();

      // reset current settings
      settings.resetAll();
      expect(settings.get('freeTestKey')).toBe('foo');

      // load settings from store and expect to be as they were
      settings.load();
      expect(settings.get('freeTestKey')).toBe('bar');
    });

    it('should clearStorage', function() {
      // change default setting and save
      settings.set('freeTestKey', 'bar');
      settings.save();

      // reset current settings
      settings.clearStorage();
      expect(settings.get('freeTestKey')).toBe('bar');

      // load settings from store and expect to be as they were
      settings.set('freeTestKey', 'baz');
      settings.load();
      expect(settings.get('freeTestKey')).toBe('baz');
    });
  });

  // describe('free settings', function() {
  //   it('defaults', function() {
  //     expect(settings.freeTestKey).toBe('foo');
  //     expect(settings.auto_switch).toBe(false);
  //   });
  // });
  //
  // describe('Enable advanced', function() {
  //   expect(settings.allowAdvanced()).toBe(false);
  // });

});
