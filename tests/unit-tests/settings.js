describe('settings', function() {

  beforeEach(module('WatchTimer'));

  var settings;

  beforeEach(
    inject(function(_settings_) {
      settings = _settings_;
    })
  );

  // make sure that there are no lingering settings in the browser local storage
  beforeEach(function() {
    settings._resetEverything();
  });

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
      expect(function() {
        settings.set('unknownTestKey', 'bar');
      }).toThrow('unknown setting \'unknownTestKey\'');

      expect(function() {
        settings.set('unknownTestKey', 'bar');
      }).toThrow('unknown setting \'unknownTestKey\'');
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

  describe('free settings', function() {

    beforeEach(function() {
      jasmine.clock().install();
      jasmine.clock().mockDate();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('defaults', function() {

      var freeTrialPeriod = 48 * 3600 * 1000;

      expect(settings.get('freeTestKey')).toBe('foo');
      expect(settings.get('paidTestKey')).toBeUndefined();
      expect(settings.mayStartFreeTrial()).toBeTruthy();
      expect(settings.mayUsePaid()).toBeFalsy();
      expect(settings.freeTrialEnds()).toBeUndefined();

      settings.startTrialPeriod();

      expect(settings.get('freeTestKey')).toBe('foo');
      expect(settings.get('paidTestKey')).toBe('foo');
      expect(settings.mayStartFreeTrial()).toBeFalsy();
      expect(settings.mayUsePaid()).toBeTruthy();
      expect(settings.freeTrialEnds()).not.toBeUndefined();

      expect(settings.freeTrialEnds() - new Date()).toBe(freeTrialPeriod);

      expect(function() {
        settings.startTrialPeriod();
      }).toThrow('can\'t start free trial, has already been started');

      // advance the clock beyond the end of the free trial period
      jasmine.clock().tick(freeTrialPeriod + 1000);

      expect(settings.get('freeTestKey')).toBe('foo');
      expect(settings.get('paidTestKey')).toBeUndefined();
      expect(settings.mayStartFreeTrial()).toBeFalsy();
      expect(settings.mayUsePaid()).toBeFalsy();

      expect(function() {
        settings.startTrialPeriod();
      }).toThrow('can\'t start free trial, has already been started');

    });
  });

  // describe('Enable advanced', function() {
  //   expect(settings.allowAdvanced()).toBeFalsy();
  // });

});
