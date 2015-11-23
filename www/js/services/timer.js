angular.module('WatchTimer')
  .factory('timer', function($rootScope, $interval, $timeout) {
    var self = this;

    self.isRunning = false;
    self.currentState = 'stopped';

    self.endTime = undefined;
    self.alertTime = undefined;
    self.alarmTime = undefined;

    var alertNotificationId = 1;
    var alarmNotificationId = 2;

    self.alarmIntervalAfterEnd = 3 * 60;

    // the "-0.8" is there so that after starting or restarting the timer the
    // time changes quickly. This is to give the user a quick response that
    // something is happening.
    self.duration = 15 * 60;
    self.duration -= 0.8;

    // listed in ascending cutoff order so that the code in _getCurrentState
    // will work correctly.
    self.states = [
      {
        name: 'alarming',
        cutoff: -self.alarmIntervalAfterEnd,
      }, {
        name: 'alerting',
        cutoff: 0,
      }, {
        name: 'notifying',
        cutoff: 2 * 60,
      }, {
        name: 'running',
        cutoff: Infinity,
      }, {
        name: 'stopped',
        cutoff: undefined,
      },
    ];

    self.start = function() {
      self.isRunning = true;
      self.setTimesAndNotifications();
      self.update();
    };

    self.stop = function() {
      self.isRunning = false;
      self.clearTimesAndNotifications();
      self.update();
    };

    self.setTimesAndNotifications = function() {
      var now = new Date();
      self.endTime = new Date(now.getTime() + self.duration * 1000);
      self.alertTime = self.endTime;
      self.alarmTime = new Date(self.endTime.getTime() + self.alarmIntervalAfterEnd * 1000);

      if (window.plugin && window.plugin.notification) {
        window.plugin.notification.local.schedule([
          {
            id: alertNotificationId,
            at: self.alertTime,
            text: 'Checkin due',
          },
          {
            id: alarmNotificationId,
            at: self.alarmTime,
            text: 'Checkin overdue',
          },
        ]);
      };

    };

    self.clearTimesAndNotifications = function() {
      self.endTime = undefined;
      self.alertTime = undefined;
      self.alarmTime = undefined;

      if (window.plugin && window.plugin.notification) {
        window.plugin.notification.local.clear([
          alertNotificationId,
          alarmNotificationId,
        ]);
      }
    };

    self.change = function(amount) {
      if (self.isRunning) {
        var now = new Date();
        var newEndTime = new Date();
        newEndTime.setTime(self.endTime.getTime() + amount * 1000);

        if (newEndTime > now) {
          self.endTime = newEndTime;
        }
      } else {
        var newDuration = self.duration + amount;
        if (newDuration > 0) {
          self.duration = newDuration;
        }
      }

      self.update();
    };

    self._getCurrentState = function() {
      if (!self.isRunning) {
        return 'stopped';
      }

      var remaining = self.remaining();
      var state = _.find(
        self.states,
        function(state) {
          return remaining < state.cutoff;
        }
      );

      return state.name;
    };

    self.remaining = function() {
      var now = new Date();
      return (self.endTime - now) / 1000;
    };

    // -----------------------

    self.update = function() {
      self.currentState = self._getCurrentState();
      self.timeToDisplay = self.isRunning ? self.remaining() : self.duration;
    };

    self.startUpdating = function() {
      self.update();

      // Try to start on the change in time
      var initialDelay = Math.ceil(self.remaining() % 1 * 1000);

      $timeout(function() {
        self.update();
        self._updateId = $interval(function() {
          self.update();
        }, 1000);
      }, initialDelay);

    };

    self.stopUpdating = function() {
      $interval.cancel(self._updateId);
    };

    // --------------------------

    return self;

  });
