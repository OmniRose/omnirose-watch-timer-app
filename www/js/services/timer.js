angular.module('WatchTimer')
  .factory('timer', function($rootScope, $interval, $timeout) {
    var self = this;

    self.isRunning = false;
    self.current_state = 'stopped';

    self.end_time = undefined;

    // the "-0.8" is there so that after starting or restarting the timer the
    // time changes quickly. This is to give the user a quick response that
    // something is happening.
    self.duration = 15 * 60;
    self.duration -= 0.8;

    // listed in ascending cutoff order so that the code in determine_state
    // will work correctly.
    self.states = [{
      name: "alarming",
      cutoff: -1 // FIXME -3 * 60
    }, {
      name: "alerting",
      cutoff: 0
    }, {
      name: "notifying",
      cutoff: 2 * 60
    }, {
      name: "running",
      cutoff: 1000000000
    }, {
      name: "stopped",
      cutoff: undefined
    }, ];

    self.start = function() {
      var end_time = new Date();
      end_time.setTime(end_time.getTime() + self.duration * 1000);
      self.end_time = end_time;

      self.isRunning = true;

      // use $timeout so that this runs after we're finished so it does not
      // conflict with our dispatch run
      $timeout(self.monitor_changes);
    };

    self.stop = function() {
      self.isRunning = false;
      $timeout(self.monitor_changes);
    };

    self.change = function(amount) {
      if (self.isRunning) {
        var now = new Date();
        var new_end_time = new Date();
        new_end_time.setTime(self.end_time.getTime() + amount * 1000);

        if (new_end_time > now) {
          self.end_time = new_end_time;
        }
      } else {
        var new_duration = self.duration + amount;
        if (new_duration > 0) {
          self.duration = new_duration;
        }
      }
    }


    self.monitor_changes = function() {

      self.determine_state();

      // Tell the scope to check for changes
      $rootScope.$apply();

      // If the timer is running then need to update later
      if (self.isRunning) {
        // how long until the next update
        var delay = Math.ceil(self.remaining() % 1 * 1000);
        $timeout(self.monitor_changes, delay);
      }
    };


    self.determine_state = function() {
      if (!self.isRunning) {
        self.current_state = 'stopped';
        return;
      }

      var remaining = self.remaining();
      var state = _.find(
        self.states,
        function(state) {
          return remaining < state.cutoff;
        }
      );

      self.current_state = state.name;
    };



    self.time_to_display = function() {
      return self.isRunning ? self.remaining() : self.duration;
    };

    self.remaining = function() {
      var now = new Date();
      return (self.end_time - now) / 1000;
    };

    return self;

  });
