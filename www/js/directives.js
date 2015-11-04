angular.module('WatchTimer')
  .directive('resizeTextToFill', function ($document, $timeout) {
    return {
      link: function (scope, element, attrs, controller, transcludeFn) {

        var font_size_increment = 20;
        var max_height = $document.height() - font_size_increment;
        var max_width  = $document.width()  - font_size_increment;

        var set_size = function (fontSize) {
          element.css({
            fontSize: fontSize + "px",
            lineHeight: fontSize + "px" // digits don't need more than this
          });
        };

        $timeout(function () {
          var fontSize = 10;
          var safety_counter = 0;
          var safety_counter_max = 100;

          while (element.height() <= max_height && element.width() <= max_width && safety_counter < safety_counter_max ) {
            safety_counter++;
            fontSize += font_size_increment;
            set_size(fontSize);
          }

          // go back down one size so we know it fits
          fontSize -= font_size_increment;
          set_size(fontSize);

          console.log({safety_counter: safety_counter, fontSize: fontSize});
        });


      }
    };
  })