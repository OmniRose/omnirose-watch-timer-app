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
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('timer', {
    url: '/',
    templateUrl: 'templates/timer.html',
    controller: function($scope, timer, sounds) {
      $scope.timer = timer;

      timer.duration = 2;
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
        }
      );

    }
  });

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  });

});
