window.ionic.Platform.ready(function() {
  angular.bootstrap(document, ['WatchTimer']);
});

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

      $scope.playSound = function(id) {
        sounds.play(id);
      }

    }
  });

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  });

});
