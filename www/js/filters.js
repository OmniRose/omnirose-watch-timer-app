angular.module('WatchTimer')
  .filter('hhmmss', function() {

    function formatNumber(number) {
      number = Math.floor(number);
      string = number + '';
      if (string.length < 2) {
        string = '0' + string;
      }

      return string;
    };

    return function(duration) {
      var duration = Math.abs(Math.ceil(duration));

      var hours = Math.floor(duration / 3600);
      var minutes = Math.floor(duration / 60 % 60);
      var seconds = Math.floor(duration % 60);

      var hhmmss = '';

      if (hours) {
        hhmmss += formatNumber(hours);
        hhmmss += ':';
      }

      hhmmss += formatNumber(minutes);
      hhmmss += ':';
      hhmmss += formatNumber(seconds);

      return hhmmss;
    };

  });
