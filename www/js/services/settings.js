angular.module('WatchTimer')
  .factory('settings', function($window) {

    var self = this;
    var localStorageKey = 'owt_settings';

    var config = {
      freeTestKey: {
        default: 'foo'
      },
    };

    var known_settings = _.keys(config);

    self.set = function(key, val) {
      if (!_.contains(known_settings, key)) {
        throw "unknown setting '" + key + "'";
      }
      self[key] = val;
    };

    self.get = function(key) {
      return self[key];
    };

    self.reset_all = function() {
      _.each(known_settings, function(key) {
        self[key] = config[key]['default'];
      });
    };

    self.save = function() {
      var to_save = _.pick(self, known_settings);
      $window.localStorage[localStorageKey] = JSON.stringify(to_save);
    };

    self.load = function() {
      var to_restore = JSON.parse($window.localStorage[localStorageKey] || '{}');

      _.each(to_restore, function(val, key) {
        self[key] = val;
      });
    };

    self.clear_storage = function() {
      $window.localStorage[localStorageKey] = JSON.stringify({});
    };

    self.reset_all();

    return self;

  });
