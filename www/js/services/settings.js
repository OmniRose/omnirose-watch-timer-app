angular.module('WatchTimer')
  .factory('settings', function($window) {

    var self = this;
    var localStorageSettingsKey = 'owt_settings';
    var localStorageTrialEndsKey = 'owt_trial_ends';
    var freeTrialDuration = 48 * 3600 * 1000;
    var freeTrialEnds = $window.localStorage[localStorageTrialEndsKey];

    var config = {
      freeTestKey: {
        default: 'foo',
        free: true,
      },
      paidTestKey: {
        default: 'foo',
        free: false,
      },
    };

    var knownSettings = _.keys(config);
    var freeSettings = _.filter(knownSettings, function(key) {
      return config[key].free;
    });

    var paidSettings = _.difference(knownSettings, freeSettings);

    self.set = function(key, val) {
      if (!_.contains(knownSettings, key)) {
        throw 'unknown setting \'' + key + '\'';
      }

      self[key] = val;
    };

    self.get = function(key) {
      if (!_.contains(knownSettings, key)) {
        throw 'unknown setting \'' + key + '\'';
      }

      if (_.contains(paidSettings, key) && !self.mayUsePaid()) {
        return undefined;
      }

      return self[key];
    };

    self.resetAll = function() {
      _.each(knownSettings, function(key) {
        self[key] = config[key]['default'];
      });
    };

    self._resetEverything = function() {
      self.resetAll();
      freeTrialEnds = undefined;
      $window.localStorage[localStorageTrialEndsKey] = undefined;
    };

    self.save = function() {
      var toSave = _.pick(self, knownSettings);
      $window.localStorage[localStorageSettingsKey] = JSON.stringify(toSave);
    };

    self.load = function() {
      var toRestore = JSON.parse($window.localStorage[localStorageSettingsKey] || '{}');

      _.each(toRestore, function(val, key) {
        self[key] = val;
      });
    };

    self.clearStorage = function() {
      $window.localStorage[localStorageSettingsKey] = JSON.stringify({});
    };

    self.mayStartFreeTrial = function() {
      return !freeTrialEnds;
    };

    self.freeTrialEnds = function() {
      return freeTrialEnds;
    };

    // var freeTrialEnds = $window.localStorage[localStorageTrialEndsKey];

    self.startTrialPeriod = function() {
      if (!self.mayStartFreeTrial()) {
        throw ('can\'t start free trial, has already been started');
      }

      var now = new Date();
      freeTrialEnds = new Date(now.getTime() + freeTrialDuration);
      $window.localStorage[localStorageTrialEndsKey] = freeTrialEnds;
      return true;
    };

    self.mayUsePaid = function() {
      var now = new Date();

      if (freeTrialEnds && now < freeTrialEnds) {
        return true;
      }

      return false;
    };

    self.resetAll();
    return self;

  });
