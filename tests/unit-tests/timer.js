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

  it('should set various times correctly', function() {
    var now = new Date();
    var duration = timer.duration;

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

  // it('should set alarms correctly', function() {
  //   var now = new Date();
  //   var duration = timer.duration;
  //
  //   // fake the local notification
  //   var notificationLocal = {};
  //   window.plugin = {notification: {local: notificationLocal}};
  //
  // });

});
