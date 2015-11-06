angular.module('WatchTimer')
  .factory('sounds', function($ionicPlatform, $cordovaMedia, $cordovaNativeAudio) {

    var sounds = this;

    var chime_src = "sounds/Electronic_Chime-KevanGC-495939803.mp3";
    var siren_src = "sounds/Siren_Noise-KevanGC-1337458893.mp3";


    if (window.plugins && window.plugins.NativeAudio) {

      console.log("Using NativeAudio");

      function preloadSuccess(msg) {
        console.log("NativeAudio preload success: " + msg);
      }

      function preloadError(error) {
        console.log("NativeAudio preload error: " + error);
      }

      $cordovaNativeAudio
        .preloadSimple('chime', chime_src)
        .then(preloadSuccess, preloadError);

      $cordovaNativeAudio
        .preloadSimple('siren', siren_src)
        .then(preloadSuccess, preloadError);

      sounds.play = function(id) {
        console.log("playing " + id);
        $cordovaNativeAudio.play(id);
      };

    } else {
      // in browser
      console.log("Using HTML5 Audio");

      var audios = {
        chime: $('<audio><source src="/' + chime_src + '" type="audio/mpeg"></audio>')[0],
        siren: $('<audio><source src="/' + siren_src + '" type="audio/mpeg"></audio>')[0],
      };

      sounds.play = function(id) {
        audios[id].play();
      };
    }

    return sounds;
  });
