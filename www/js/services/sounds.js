angular.module('WatchTimer')
  .factory('sounds', function($ionicPlatform, $cordovaMedia, $cordovaNativeAudio) {

    var sounds = this;

    // noops for until the audio has been set up
    sounds.play = function() {};
    sounds.loop = function() {};
    sounds.stopAll = function() {};

    var alert_src = "sounds/Electronic_Chime-KevanGC-495939803.mp3";
    var alarm_src = "sounds/Siren_Noise-KevanGC-1337458893.mp3";

    $ionicPlatform.ready(
      function() {
        if (window.plugins && window.plugins.NativeAudio) {
          setupNativeAudio();
        } else {
          setupHtml5Audio();
        }
      }
    );

    function setupNativeAudio() {
      console.log("Using NativeAudio");

      function callbackSuccess(msg) {
        console.log("NativeAudio success: " + msg);
      }

      function callbackError(error) {
        console.log("NativeAudio error: " + error);
      }

      $cordovaNativeAudio
        .preloadComplex('alert', alert_src,
          1, // Volume
          1, // voices
          0, // delay
          callbackSuccess,
          callbackError);

      $cordovaNativeAudio
        .preloadComplex('alarm', alarm_src,
          1, // Volume
          1, // voices
          0, // delay
          callbackSuccess,
          callbackError);

      sounds.play = function(id) {
        // console.log("in play");
        $cordovaNativeAudio.play(id, callbackSuccess, callbackError);
      };

      sounds.loop = function(id) {
        // console.log("in loop");
        $cordovaNativeAudio.loop(id, callbackSuccess, callbackError);
      };

      sounds.stopAll = function() {
        // console.log("in loop");
        $cordovaNativeAudio.stop('alert', callbackSuccess, callbackError);
        $cordovaNativeAudio.stop('alarm', callbackSuccess, callbackError);
      }

      // Sometimes between restarts the audio is not stopped. Stop it here so
      // that we know it is not playing at the begining of a dev run.
      sounds.stopAll();

    }

    function setupHtml5Audio() {
      // in browser
      console.log("Using HTML5 Audio");

      var audios = {
        alert: $('<audio><source src="/' + alert_src + '" type="audio/mpeg"></audio>')[0],
        alarm: $('<audio><source src="/' + alarm_src + '" type="audio/mpeg"></audio>')[0],
      };

      sounds.play = function(id) {
        audios[id].play();
      };

      sounds.loop = function(id) {
        var audio = audios[id];
        audio.onended = function() {
          audio.play();
        };
        audio.play();
      };

      sounds.stopAll = function() {
        _.each(['alert', 'alarm'], function(id) {
          var audio = audios[id];
          audio.onended = undefined;
          audio.pause();
          audio.currentTime = 0;
        });
      }
    }

    return sounds;

  });
