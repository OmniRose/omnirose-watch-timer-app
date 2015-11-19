angular.module('WatchTimer')
  .factory('checkins', function($interval) {
    var self = this;

    self._entries = [];

    self.add = function(action) {
      self._entries.unshift({
        action: action,
        when: new Date()
      });

      // Only keep the most recent 20 entries
      while (self._entries.length > 20) {
        self._entries.pop();
      }

      self.update();
    };

    self.most_recent = function() {
      return self._entries[0];
    }

    self.update = function() {
      var now = new Date();
      var most_recent_when = self.most_recent().when;
      self.seconds_since_last_checkin = (now - most_recent_when) / 1000;
      self.time_of_last_checkin = most_recent_when;
    };

    self.start_updating = function() {
      self.update();
      self._update_id = $interval(function() {
        self.update();
      }, 1000);
    };

    self.stop_updating = function() {
      $interval.cancel(self._update_id);
    };

    // Add an entry now
    self.add('startup');

    return self;
  });
