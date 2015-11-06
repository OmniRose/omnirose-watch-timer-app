(function() {

  function format_number(number) {
    number = Math.floor(number);
    string = number + "";
    if (string.length < 2) {
      string = "0" + string;
    }
    return string;
  };

  angular.module('WatchTimer')
    .factory('timer', function($rootScope, $interval, $timeout) {
      var timer = this;

      timer.isRunning = false;
      timer.current_state = 'stopped';

      timer.end_time = undefined;
      timer.time_last_button_pressed = undefined; // TODO - wire this up

      // the "-0.8" is there so that after starting or restarting the timer the
      // time changes quickly. This is to give the user a quick response that
      // something is happening.
      timer.duration = 15 * 60 - 0.8;

      // listed in ascending cutoff order so that the code in determine_state
      // will work correctly.
      timer.states = [{
        name: "alarming",
        cutoff: -3 * 60
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

      timer.record_button_press = function() {
        timer.time_last_button_pressed = new Date();
      }

      timer.start = function() {
        timer.record_button_press();

        var end_time = new Date();
        end_time.setTime(end_time.getTime() + timer.duration * 1000);
        timer.end_time = end_time;

        timer.isRunning = true;

        // use $timeout so that this runs after we're finished so it does not
        // conflict with our dispatch run
        $timeout(timer.monitor_changes);
      };

      timer.stop = function() {
        timer.record_button_press();
        timer.isRunning = false;
        $timeout(timer.monitor_changes);
      };

      timer.increment = function() {
        timer.record_button_press();
        timer.change(60);
      }

      timer.decrement = function() {
        timer.record_button_press();
        timer.change(-60);
      }

      timer.change = function(amount) {
        if (timer.isRunning) {
          var now = new Date();
          var new_end_time = new Date();
          new_end_time.setTime(timer.end_time.getTime() + amount * 1000);

          if (new_end_time > now) {
            timer.end_time = new_end_time;
          }
        } else {
          var new_duration = timer.duration + amount;
          if (new_duration > 0) {
            timer.duration = new_duration;
          }
        }
      }

      timer.toggle = function() {
        timer.isRunning ? timer.stop() : timer.start();
      };

      timer.monitor_changes = function() {

        timer.determine_state();

        // Tell the scope to check for changes
        $rootScope.$apply();

        // If the timer is running then need to update later
        if (timer.isRunning) {
          // how long until the next update
          var delay = Math.ceil(timer.remaining() % 1 * 1000);
          $timeout(timer.monitor_changes, delay);
        }
      };


      timer.determine_state = function() {
        if (!timer.isRunning) {
          timer.current_state = 'stopped';
          return;
        }

        var remaining = timer.remaining();
        var state = _.find(
          timer.states,
          function(state) {
            return remaining < state.cutoff;
          }
        );

        timer.current_state = state.name;
      };



      timer.getFormattedTime = function() {
        var to_format = timer.isRunning ? timer.remaining() : timer.duration;
        return timer.formatTime(to_format);
      };

      timer.remaining = function() {
        var now = new Date();
        return elapsed = (timer.end_time - now) / 1000;
      };

      timer.formatTime = function(seconds) {
        var seconds = Math.abs(Math.ceil(seconds));
        var mm = format_number(seconds / 60);
        var ss = format_number(seconds % 60);

        return mm + ":" + ss;
      };

      return timer;

    });
})();
