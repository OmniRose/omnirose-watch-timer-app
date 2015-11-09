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
      timer.stop();
      timer.start_updating();
    },
    onExit: function(timer) {
      console.log("timer onExit");
      timer.stop_updating();
    },
    controller: "TimerCtrl"
  });

  $stateProvider.state('alarm', {
    url: '/alarm',
    templateUrl: 'templates/alarm.html',
    onEnter: function(timer, checkins) {
      console.log("alarm onEnter");
      checkins.start_updating();
    },
    onExit: function(checkins) {
      console.log("alarm onExit");
      checkins.stop_updating();
    },
    controller: "AlarmCtrl"
  });

  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html'
  });

});
