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

      self.update();
    };

    self.stop = function() {
      self.isRunning = false;
      self.update();
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
      self.update();
    }

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



    self.remaining = function() {
      var now = new Date();
      return (self.end_time - now) / 1000;
    };

    // -----------------------

    self.update = function() {

      self.determine_state();

      self.time_to_display = self.isRunning ? self.remaining() : self.duration;

    };

    self.start_updating = function() {
      self.update();

      // Try to start on the change in time
      var initial_delay = Math.ceil(self.remaining() % 1 * 1000);

      $timeout(function() {
        self.update();
        self._update_id = $interval(function() {
          self.update();
        }, 1000);
      }, initial_delay);

    };

    self.stop_updating = function() {
      $interval.cancel(self._update_id);
    };

    // --------------------------


    return self;

  });
