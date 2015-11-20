angular.module('WatchTimer')
  .factory('checkins', function($interval) {
    var self = this;

    self._entries = [];

    self.add = function(action) {
      self._entries.unshift({
        action: action,
        when: new Date(),
      });

      // Only keep the most recent 20 entries
      while (self._entries.length > 20) {
        self._entries.pop();
      }

      self.update();
    };

    self.mostRecent = function() {
      return self._entries[0];
    };

    self.update = function() {
      var now = new Date();
      var mostRecentWhen = self.mostRecent().when;
      self.secondsSincelastcheckin = (now - mostRecentWhen) / 1000;
      self.timeOfLastCheckin = mostRecentWhen;
    };

    self.startUpdating = function() {
      self.update();
      self._updateId = $interval(function() {
        self.update();
      }, 1000);
    };

    self.stopUpdating = function() {
      $interval.cancel(self._updateId);
    };

    // Add an entry now
    self.add('startup');

    return self;
  });
