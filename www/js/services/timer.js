angular.module('WatchTimer')
.factory('timer', function ($rootScope, $interval, $timeout) {
  var timer = this;

  timer.isRunning = false;
  timer.interval_promise = undefined;

  timer.start_time = new Date();
  timer.duration = 9 * 60 + 10; //15 * 60 + 0.2;

  timer.start = function () {
    timer.start_time = new Date();
    timer.isRunning = true;

    if (! timer.interval_promise) {
      // put the rootScope.$apply inside a timeout so that it does not clash
      // with any other apply cycle.
      $timeout(function () {
        timer.interval_promise = $interval(
          $rootScope.$apply(), // just tell it that the time will have changed
          1000
        );
      });
    }
  };

  timer.stop = function () {
    timer.isRunning = false;
    if (timer.interval_promise) {
      $interval.cancel(timer.interval_promise);
    }
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

  var format_number = function (number) {
    number = Math.floor(number);
    string = number + "";
    if (string.length < 2) {
      string = "0" + string;
    }
    return string;
  };

  return timer;

});
