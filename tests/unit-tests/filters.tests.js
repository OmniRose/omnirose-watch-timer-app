describe('filters', function() {

  beforeEach(module('WatchTimer'));

  var $filter;

  beforeEach(inject(function(_$filter_) {
    $filter = _$filter_;
  }));

  describe('hhmmss', function() {

    it('should convert seconds to hh:mm:ss format', function() {
      var hhmmss = $filter('hhmmss');

      expect(hhmmss(0)).toBe('00:00');
      expect(hhmmss(0.1)).toBe('00:01');
      expect(hhmmss(60)).toBe('01:00');
      expect(hhmmss(3600)).toBe('01:00:00');

      expect(hhmmss(-1)).toBe('00:01');

    });

  });
});
