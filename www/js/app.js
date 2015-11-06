angular.module('WatchTimer', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/timer');

  $stateProvider.state('timer', {
    url: '/timer',
    templateUrl: 'templates/timer.html',
    onEnter: function(timer) {
      console.log("timer onEnter");
      timer.start_updating();
    },
    onExit: function(timer) {
      console.log("timer onExit");
      timer.stop_updating();
    },
    controller: function($scope, timer, checkins, sounds, $state) {
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
        }
      );

    }
  });

  $stateProvider.state('alarm', {
    url: '/alarm',
    templateUrl: 'templates/alarm.html',
    onEnter: function(timer, checkins) {
      console.log("alarm onEnter");
      timer.stop();
      checkins.start_updating();
    },
    onExit: function(checkins) {
      console.log("alarm onExit");
      checkins.stop_updating();
    },
    controller: function($scope, timer, sounds, checkins) {
      var alarm = this;

      $scope.timer = timer;
      $scope.checkins = checkins;

      $scope.seconds_since_last_checkin = checkins.seconds_since_last_checkin;

      // Trigger the alarm sound
      console.log("FIXME - re-enable alarm sound here");
      // sounds.loop('alarm');

      $scope.silence = function(clickEvent) {
        sounds.stopAll();
        $scope.alarmSilenced = true;
      }

    }
  });

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  });

});
