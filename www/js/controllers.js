angular.module('WatchTimer')

.controller('TimerCtrl', function($scope, timer, checkins, sounds, $state) {
  var controller = this;

  $scope.timer = timer;

  $scope.toggleTimer = function() {
    timer.isRunning ? $scope.stopTimer() : $scope.startTimer();
  };

  $scope.stopTimer = function() {
    checkins.add('stop');
    timer.stop();
  };

  $scope.startTimer = function() {
    checkins.add('start');
    timer.start();
  };

  $scope.incrementTimer = function() {
    checkins.add('increment');
    timer.change(60);
  };

  $scope.decrementTimer = function() {
    checkins.add('decrement');
    timer.change(-60);
  };

  timer.duration = 4.2;

  // timer.start(); // FIXME

  // Watch the current state and start looping the bong if alerting
  $scope.$watch(
    'timer.currentState',
    function(newState, oldState) {
      console.log('State change: ' + oldState + ' -> ' + newState);

      // On all state changes we can stop the previous sounds
      sounds.stopAll();

      if (newState === 'alerting') {
        sounds.loop('alert');
      }

      if (newState === 'alarming') {
        $state.go('top.alarm');
      }

    });
})

.controller('AlarmCtrl',
  function($scope, sounds, checkins) {
    var alarm = this;

    $scope.checkins = checkins;
    $scope.alarmSilenced = false;

    $scope.secondsSincelastcheckin = checkins.secondsSincelastcheckin;

    // Trigger the alarm sound
    sounds.loop('alarm');

    $scope.silence = function(clickEvent) {
      sounds.stopAll();
      $scope.alarmSilenced = true;
    };

  });
