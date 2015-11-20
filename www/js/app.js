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
  $urlRouterProvider.otherwise('/top/timer');

  // top view so that we know that we'll always enter and exit the lower states,
  // none of them will be assumed to be the top state.
  $stateProvider.state('top', {
    abstract: true,
    url: '/top',
    template: '<ui-view />',
  });

  $stateProvider.state('top.timer', {
    url: '/timer',
    templateUrl: 'templates/timer.html',
    onEnter: function(timer) {
      console.log('timer onEnter');
      timer.stop();
      timer.startUpdating();
    },

    onExit: function(timer) {
      console.log('timer onExit');
      timer.stopUpdating();
    },

    controller: 'TimerCtrl',
  });

  $stateProvider.state('top.alarm', {
    url: '/alarm',
    templateUrl: 'templates/alarm.html',
    onEnter: function(timer, checkins) {
      console.log('alarm onEnter');
      checkins.startUpdating();
    },

    onExit: function(checkins) {
      console.log('alarm onExit');
      checkins.stopUpdating();
    },

    controller: 'AlarmCtrl',
  });

  $stateProvider.state('top.settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
  });

});
