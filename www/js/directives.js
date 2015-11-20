angular.module('WatchTimer')
  .directive('resizeTextToFill', function($window, $timeout) {
    return {
      link: function(scope, element, attrs, controller, transcludeFn) {

        var initialFontSize = 10;
        var fontSizeIncrement = 20;

        var safetyCounterMax = 100;

        function setSize(fontSize) {
          element.css({
            fontSize: fontSize + 'px',
            lineHeight: fontSize + 'px', // digits don't need more than this
          });
        }

        function resizeToFit() {
          var fontSize = initialFontSize;
          var maxHeight = $($window).height() - fontSizeIncrement;
          var maxWidth = $($window).width() - fontSizeIncrement;
          var safetyCounter = 0;

          setSize(fontSize);

          while (
            element.height() <= maxHeight && element.width() <= maxWidth && safetyCounter < safetyCounterMax
          ) {
            safetyCounter++;
            fontSize += fontSizeIncrement;
            setSize(fontSize);
          }

          // go back down one size so we know it fits
          fontSize -= fontSizeIncrement;
          setSize(fontSize);
        }

        $timeout(function() {
          resizeToFit();
        });

        // 'resize' as the chrome dev toolkit does not trigger an
        // 'orientationchange' event when switching between oriantations.
        $($window).on('resize orientationchange', resizeToFit);

      },
    };
  });
