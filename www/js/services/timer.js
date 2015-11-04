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

    timer.start_time = new Date();
    timer.duration = 9 * 60 + 10; //15 * 60 + 0.2;

    timer.start = function () {
      timer.start_time = new Date();
      timer.isRunning = true;

      // start the
      timer.pokeScope();
    };

    timer.stop = function () {
      timer.isRunning = false;
      if (timer.interval_promise) {
        $interval.cancel(timer.interval_promise);
      }
    };

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
      var elapsed = (now - timer.start_time) / 1000;
      return timer.duration - elapsed;
    };

    timer.formatTime = function (seconds) {
      var seconds = Math.ceil(seconds);
      var mm = format_number(seconds / 60);
      var ss = format_number(seconds % 60);

      return mm + ":" + ss;
    };

    return timer;

  });
})();
