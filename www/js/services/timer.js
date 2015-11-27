angular.module('WatchTimer')
  .factory('timer', function($rootScope, $interval, $timeout, sounds) {
    var self = this;

    self.isRunning = false;
    self.currentState = 'stopped';

    self.endTime = undefined;
    self.alertTime = undefined;
    self.alarmTime = undefined;

    self.alarmIntervalAfterEnd = 3 * 60;

    // the "-0.8" is there so that after starting or restarting the timer the
    // time changes quickly. This is to give the user a quick response that
    // something is happening.
    self.duration = 15 * 60;
    self.duration -= 0.8;

    // listed in ascending cutoff order so that the code in _getCurrentState
    // will work correctly.
    self.states = [{
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
    }, ];

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

        var notificationId = 1;
        var notifications = [];

        var alertNotificationInterval = 5 * 1000;
        var specificAlertTime = new Date(self.alertTime.getTime());

        var alarmNotificationInterval = 10 * 1000; // slightly longer than the siren sound
        var specificAlarmTime = new Date(self.alarmTime.getTime());
        var alarmTimePlusOneMinute = new Date(self.alarmTime.getTime() + 60 * 1000);

        var howLongAgo = function(now, time) {
          var millis = now - time;
          var secs = millis / 1000;
          return secs ? secs + ' seconds ago' : 'now';
        };

        // create alerts leading up to the alarm
        while (specificAlertTime < self.alarmTime) {
          notifications.push({
            id: notificationId++,
            at: specificAlertTime,
            title: 'Check-in due ' + howLongAgo(specificAlertTime, self.alertTime),
            sound: 'file://' + sounds.alertSource,
          });
          specificAlertTime = new Date(specificAlertTime.getTime() + alertNotificationInterval);
        }

        // create alarms indefinately
        while (specificAlarmTime < alarmTimePlusOneMinute) {
          notifications.push({
            id: notificationId++,
            at: specificAlarmTime,
            every: 'minute',
            text: 'Check-in overdue - was due ' + howLongAgo(specificAlarmTime, self.alertTime),
            sound: 'file://' + sounds.alarmSource,
          });
          specificAlarmTime = new Date(specificAlarmTime.getTime() + alarmNotificationInterval);
        }

        window.plugin.notification.local.schedule(notifications);
      };

    };

    self.clearTimesAndNotifications = function() {
      self.endTime = undefined;
      self.alertTime = undefined;
      self.alarmTime = undefined;

      if (window.plugin && window.plugin.notification) {
        window.plugin.notification.local.clearAll();
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

      // FIXME - setTimesAndNotifications here too

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
