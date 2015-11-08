angular.module('WatchTimer')
  .directive('resizeTextToFill', function($window, $timeout) {
    return {
      link: function(scope, element, attrs, controller, transcludeFn) {

        var initial_font_size = 10;
        var font_size_increment = 20;

        var safety_counter_max = 100;

        function set_size(font_size) {
          element.css({
            fontSize: font_size + "px",
            lineHeight: font_size + "px" // digits don't need more than this
          });
        }

        function resize_to_fit() {
          var font_size = initial_font_size;
          var max_height = $($window).height() - font_size_increment;
          var max_width = $($window).width() - font_size_increment;
          var safety_counter = 0;

          set_size(font_size);

          while (
            element.height() <= max_height && element.width() <= max_width && safety_counter < safety_counter_max
          ) {
            safety_counter++;
            font_size += font_size_increment;
            set_size(font_size);
          }

          // go back down one size so we know it fits
          font_size -= font_size_increment;
          set_size(font_size);
        }

        $timeout(function() {
          resize_to_fit();
        });

        // 'resize' as the chrome dev toolkit does not trigger an
        // 'orientationchange' event when switching between oriantations.
        $($window).on("resize orientationchange", resize_to_fit);

      }
    };
  })
