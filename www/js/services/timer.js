(function() {


  angular.module('WatchTimer')
    .factory('timer', function($rootScope, $interval, $timeout) {
      var timer = this;

      timer.isRunning = false;
      timer.current_state = 'stopped';

      timer.end_time = undefined;

      // the "-0.8" is there so that after starting or restarting the timer the
      // time changes quickly. This is to give the user a quick response that
      // something is happening.
      timer.duration = 15 * 60;
      timer.duration -= 0.8;

      // listed in ascending cutoff order so that the code in determine_state
      // will work correctly.
      timer.states = [{
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

      timer.start = function() {
        var end_time = new Date();
        end_time.setTime(end_time.getTime() + timer.duration * 1000);
        timer.end_time = end_time;

        timer.isRunning = true;

        // use $timeout so that this runs after we're finished so it does not
        // conflict with our dispatch run
        $timeout(timer.monitor_changes);
      };

      timer.stop = function() {
        timer.isRunning = false;
        $timeout(timer.monitor_changes);
      };

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



      timer.time_to_display = function() {
        return timer.isRunning ? timer.remaining() : timer.duration;
      };

      timer.remaining = function() {
        var now = new Date();
        return (timer.end_time - now) / 1000;
      };

      return timer;

    });
})();
