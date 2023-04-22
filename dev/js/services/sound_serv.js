(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('SoundPlayServ',

  function() {
    /*jshint validthis:true */
    var thisFactory = this;

    thisFactory.soundsIntervals = {
      menu: {start: 7.93, end: 11.7},
      swip: {start: 8, end: 9},
      price: {from: 21.5, to: 23.2},
      fly: {start: 0.57, end: 1.59},
      switching: {start: 1.81, end: 2.88}
    };




    /**============ METHODS ================*/

    //----------- Play audio sounds
    function playSound() {
      var audioPlayer = document.getElementById('sounds');
      // audioPlayer.play();
    }
    /*
     function playSound(element) {
     var audioPlayer = document.getElementById('sounds');
     //console.log('currentTime1', audioPlayer.currentTime);
     audioPlayer.pause();
     audioPlayer.currentTime = soundsIntervals[element].from;
     if(audioPlayer.currentTime === soundsIntervals[element].from) {
     audioPlayer.play();
     audioPlayer.addEventListener('timeupdate', handle, false);
     }
     //console.log('currentTime2', audioPlayer.currentTime);
     function handle() {
     var end = soundsIntervals[element].to;
     //console.log(this.currentTime + ' = ' + end);
     if(this.currentTime >= end) {
     this.pause();
     this.removeEventListener('timeupdate', handle);
     }
     }
     }
     */


    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      playSound: playSound
    };

    return thisFactory.publicObj;

  });
})();
