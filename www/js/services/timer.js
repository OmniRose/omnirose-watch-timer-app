angular.module('WatchTimer')
  .factory('timer', function($rootScope, $interval, $timeout) {
    var self = this;

    self.isRunning = false;
    self.currentState = 'stopped';

    self.endTime = undefined;

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
        cutoff: -3, // FIXME -3 * 60
      }, {
        name: 'alerting',
        cutoff: 0,
      }, {
        name: 'notifying',
        cutoff: 2 * 60,
      }, {
        name: 'running',
        cutoff: 1000000000,
      }, {
        name: 'stopped',
        cutoff: undefined,
      },
    ];

    self.start = function() {
      var endTime = new Date();
      endTime.setTime(endTime.getTime() + self.duration * 1000);
      self.endTime = endTime;

      self.isRunning = true;

      self.update();
    };

    self.stop = function() {
      self.isRunning = false;
      self.update();
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
