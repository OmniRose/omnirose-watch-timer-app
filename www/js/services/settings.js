angular.module('WatchTimer')
  .factory('settings', function($window) {

    var self = this;
    var localStorageKey = 'owt_settings';

    var config = {
      freeTestKey: {
        default: 'foo',
      },
    };

    var knownSettings = _.keys(config);

    self.set = function(key, val) {
      if (!_.contains(knownSettings, key)) {
        throw 'unknown setting \'' + key + '\'';
      }

      self[key] = val;
    };

    self.get = function(key) {
      return self[key];
    };

    self.resetAll = function() {
      _.each(knownSettings, function(key) {
        self[key] = config[key]['default'];
      });
    };

    self.save = function() {
      var toSave = _.pick(self, knownSettings);
      $window.localStorage[localStorageKey] = JSON.stringify(toSave);
    };

    self.load = function() {
      var toRestore = JSON.parse($window.localStorage[localStorageKey] || '{}');

      _.each(toRestore, function(val, key) {
        self[key] = val;
      });
    };

    self.clearStorage = function() {
      $window.localStorage[localStorageKey] = JSON.stringify({});
    };

    self.resetAll();

    return self;

  });
