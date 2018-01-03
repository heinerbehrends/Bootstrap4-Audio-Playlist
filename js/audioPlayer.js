$(document).ready(function() {
  // __________VARIABLES_____________
  var playPause = $('.play-pause');
  var playButton = $('#play-button');
  var pauseButton = $('#pause-button');
  var nextButton = $('#next-button');
  var audioPlayer = $('#audio-player');
  var thumbnail = $('#thumbnail');
  var slider = $('.progress-bar').slider({
    step: 0.01
  });
  var thisSong = $('.active.playlist-item');
  var playlistItems = $('.playlist-item');
  var title =$('#title');
  var nowPlaying = $('#now-playing');

  // __________FUNCTIONS_____________
  // Toggle UI buttons
  function togglePlayPause() {
    playButton.toggleClass("d-none");
    pauseButton.toggleClass('d-none');
  };
  // Loads the title information into the #title element
  function trackName() {
    title.html(thisSong.html());
  }
  // Load next track and updates the UI.
  // Use dest = 'this' as call(this, 'this') to go the clicked items
  // Use nextTrack() to go to the next playlist item. If the current
  // playlist item is the last, it will go to the first.
  function nextTrack(dest) {
    // Toggle Play/Pause button if paused
    if (playButton.is(':visible')) {
      togglePlayPause();
    }
    // Update UI
    thisSong.toggleClass('active');
    // Set default value for dest
    if (dest !== 'this') {
      dest = 'next';
    }
    // Update active playlist item NEXT
    if (dest === 'next') {
      if (thisSong.is(':last-child')) {
        thisSong = $('.playlist-item').first();
      } else {
        thisSong = thisSong.next();
      }
    }
    // Update active playlist item THIS
    else if (dest === 'this') {
      thisSong = $(this);
    }
    // Update src and UI
    audioPlayer['0'].pause();
    thisSong.toggleClass('active');
    trackName();
    audioPlayer.attr('src', thisSong.attr('audio_url'));
    thumbnail.attr('src', thisSong.attr('img_url'));
    // Reset time and play
    audioPlayer['0'].currentTime = 0;
    audioPlayer['0'].play();
  }
  
  // Load the Play Pause Button functionality
  playPause.click(function() {
    if (audioPlayer['0'].paused === true) {
      audioPlayer['0'].play();
      togglePlayPause();
      trackName();
      nowPlaying.slideDown();
      //Change icon to Pause
    }
    else {
      audioPlayer['0'].pause();
      togglePlayPause();
    }
  });

  //  SLIDER
  $('.progress-bar').slider();
  // moves the slider on progress
  audioPlayer.on('timeupdate', function() {
    // $('.progress').attr("aria-value-now", this.currentTime / this.duration * 100);
    // $('.progress-bar').css("width", this.currentTime / this.duration * 100);

    slider.slider( "option", "value", this.currentTime / this.duration * 100 );
  });
  //  changes playback time on slider input
  slider.on('slidestop', function( event, ui ) {
    var newTime = ui.value / 100 * audioPlayer['0'].duration;
    audioPlayer['0'].currentTime = newTime;
  })

  //   PLAYLIST
  audioPlayer.attr("src", thisSong.attr('audio_url'));
  // NEXT button functionality
  nextButton.click(function() {
    audioPlayer['0'].pause();
    nextTrack();
  });

  // Click on playlist items functionality
  playlistItems.click(function() {
    nowPlaying.slideDown();
    if (audioPlayer['0'].paused) {
      togglePlayPause();
    }
    audioPlayer['0'].pause();
    // call the global nextTrack('this') function from within the current function scope
    nextTrack.call(this, 'this');
  });

  // Go to next track when track has ended

  audioPlayer.bind('ended', function() {
    // done playing
    nextTrack();
  });
});
