describe('timer', function() {

  beforeEach(module('WatchTimer'));

  var timer;

  beforeEach(
    inject(function(_timer_) {
      timer = _timer_;
    })
  );

  beforeEach(function() {
    var baseTime = new Date(2015, 0, 1);

    jasmine.clock().install();
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  describe('end time changes', function() {

    it('test', function() {

      var duration = 15 * 60 - 0.8;
      var now = new Date();

      expect(timer.duration).toBe(duration);

      expect(timer.endTime).toBeUndefined();
      expect(timer.alertTime).toBeUndefined();
      expect(timer.alarmTime).toBeUndefined();

      timer.start();

      expect(timer.endTime.getTime()).toBe(now.getTime() + duration * 1000);
      expect(timer.alertTime.getTime()).toBe(now.getTime() + duration * 1000);
      expect(timer.alarmTime.getTime()).toBe(now.getTime() + (duration + timer.alarmIntervalAfterEnd) * 1000);

      timer.stop();

      expect(timer.endTime).toBeUndefined();
      expect(timer.alertTime).toBeUndefined();
      expect(timer.alarmTime).toBeUndefined();
    });

  });

});
