(function () {

  function format_number (number) {
    number = Math.floor(number);
    string = number + "";
    if (string.length < 2) {
      string = "0" + string;
    }
    return string;
  };

  angular.module('WatchTimer')
  .factory('timer', function ($rootScope, $interval, $timeout) {
    var timer = this;

    timer.isRunning = false;

    timer.end_time = undefined;
    timer.time_last_button_pressed = undefined; // TODO - wire this up
    timer.duration = 15 * 60;

    timer.record_button_press = function () {
      timer.time_last_button_pressed = new Date();
    }

    timer.start = function () {
      timer.record_button_press();

      var end_time = new Date();
      end_time.setTime( end_time.getTime() + timer.duration * 1000);
      timer.end_time = end_time;

      timer.isRunning = true;

      // start the
      timer.pokeScope();
    };

    timer.stop = function () {
      timer.record_button_press();
      timer.isRunning = false;
    };

    timer.increment = function () {
      timer.record_button_press();
      timer.change(60);
    }

    timer.decrement = function () {
      timer.record_button_press();
      timer.change(-60);
    }

    timer.change = function (amount) {
      if (timer.isRunning) {
        var now = new Date();
        var new_end_time = new Date();
        new_end_time.setTime(timer.end_time.getTime() + amount * 1000);

        if (new_end_time > now ) {
          timer.end_time = new_end_time;
        }
      } else {
        var new_duration = timer.duration + amount;
        if (new_duration > 0) {
          timer.duration = new_duration;
        }
      }
    }

    timer.toggle = function () {
      timer.isRunning ? timer.stop() : timer.start();
    };

    timer.pokeScope = function () {
      // If the timer is no longer running then no need to update
      if (!timer.isRunning) {
        return;
      }

      // use $timeout to run the $apply so that we don't conflict with any other
      // loop that is running.
      $timeout(function () {$rootScope.$apply();});

      // how long until the next update
      var delay = Math.ceil(timer.remaining() % 1 * 1000);
      $timeout(timer.pokeScope, delay);
    };

    timer.getFormattedTime = function ( ) {
      if (timer.isRunning) {
        return timer.formatTime(timer.remaining());
      } else {
        return timer.formatTime(timer.duration);
        timer.interval_promise = undefined;
      }
    };

    timer.remaining = function () {
      var now = new Date();
      return elapsed = (timer.end_time - now) / 1000;
    };

    timer.formatTime = function (seconds) {
      var seconds = Math.abs(Math.ceil(seconds));
      var mm = format_number(seconds / 60);
      var ss = format_number(seconds % 60);

      return mm + ":" + ss;
    };

    return timer;

  });
})();
