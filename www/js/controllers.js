angular.module('WatchTimer')

.controller("TimerCtrl", function($scope, timer, checkins, sounds, $state) {
  var controller = this;

  $scope.timer = timer;

  $scope.toggle_timer = function() {
    timer.isRunning ? $scope.stop_timer() : $scope.start_timer();
  };

  $scope.stop_timer = function() {
    checkins.add('stop');
    timer.stop();
  };

  $scope.start_timer = function() {
    checkins.add('start');
    timer.start();
  };

  $scope.increment_timer = function() {
    checkins.add('increment');
    timer.change(60);
  };

  $scope.decrement_timer = function() {
    checkins.add('decrement');
    timer.change(-60);
  };

  timer.duration = 1.2;
  // timer.start(); // FIXME

  // Watch the current state and start looping the bong if alerting
  $scope.$watch(
    "timer.current_state",
    function(newState, oldState) {
      console.log("State change: " + oldState + " -> " + newState);

      // On all state changes we can stop the previous sounds
      sounds.stopAll();

      if (newState === 'alerting') {
        sounds.loop('alert');
      }

      if (newState === 'alarming') {
        $state.go('alarm');
      }

    });
})

.controller("AlarmCtrl",
  function($scope, sounds, checkins) {
    var alarm = this;

    $scope.checkins = checkins;
    $scope.alarmSilenced = false;

    $scope.seconds_since_last_checkin = checkins.seconds_since_last_checkin;

    // Trigger the alarm sound
    console.log("FIXME - re-enable alarm sound here");
    // sounds.loop('alarm');

    $scope.silence = function(clickEvent) {
      sounds.stopAll();
      $scope.alarmSilenced = true;
    }

  });
