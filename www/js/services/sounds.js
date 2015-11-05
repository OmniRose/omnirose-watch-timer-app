angular.module('WatchTimer')
  .factory('sounds', function($ionicPlatform, $cordovaMedia) {

    var sounds = this;

    $ionicPlatform.ready(function() {

      // var iOSPlayOptions = {
      //   playAudioWhenScreenIsLocked: true
      // }

      var chime_src = "/sounds/Electronic_Chime-KevanGC-495939803.mp3";
      var siren_src = "/sounds/Siren_Noise-KevanGC-1337458893.mp3";

      // create media promise
      try {
        // on iOS
        sounds.chime = $cordovaMedia.newMedia(chime_src);
        sounds.siren = $cordovaMedia.newMedia(siren_src);
      } catch (e) {
        // in browser
        sounds.chime = $('<audio><source src="' + chime_src + '" type="audio/mpeg"></audio>')[0];
        sounds.siren = $('<audio><source src="' + siren_src + '" type="audio/mpeg"></audio>')[0];
      }

    });


    return sounds;
  });
