// Horizontal video showcase: muted autoplay only while a video is in view
// and the tab is active; pauses otherwise. Never autoplays with sound.
// Respects prefers-reduced-motion (no autoplay at all, user must press play).
(function () {
  var carousels = document.querySelectorAll('[data-video-carousel]');
  if (!carousels.length) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector('.video-track');
    var prevBtn = carousel.querySelector('[data-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-carousel-next]');
    var videos = Array.prototype.slice.call(carousel.querySelectorAll('video'));

    if (prevBtn) prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -340, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: 340, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    videos.forEach(function (video) {
      video.muted = true;
      video.playsInline = true;
      var card = video.closest('.video-card');
      var toggle = card ? card.querySelector('.video-play-toggle') : null;
      var soundToggle = card ? card.querySelector('.video-sound-toggle') : null;

      function play() { if (!reduceMotion) { video.play().catch(function () {}); if (toggle) toggle.textContent = '⏸'; } }
      function pause() { video.pause(); if (toggle) toggle.textContent = '▶'; }

      if (toggle) {
        toggle.addEventListener('click', function () {
          if (video.paused) { video.play(); toggle.textContent = '⏸'; }
          else { video.pause(); toggle.textContent = '▶'; }
        });
      }

      if (soundToggle) {
        soundToggle.addEventListener('click', function () {
          var turnSoundOn = video.muted;
          if (turnSoundOn) {
            videos.forEach(function (otherVideo) {
              otherVideo.muted = true;
              var otherCard = otherVideo.closest('.video-card');
              var otherButton = otherCard ? otherCard.querySelector('.video-sound-toggle') : null;
              if (otherButton) {
                otherButton.innerHTML = '&#128263;';
                otherButton.setAttribute('aria-label', 'Turn sound on');
                otherButton.setAttribute('aria-pressed', 'false');
              }
            });
          }
          video.muted = !turnSoundOn;
          video.defaultMuted = !turnSoundOn;
          video.volume = 1;
          if (turnSoundOn) video.removeAttribute('muted');
          else video.setAttribute('muted', '');
          soundToggle.innerHTML = turnSoundOn ? '&#128266;' : '&#128263;';
          soundToggle.setAttribute('aria-label', turnSoundOn ? 'Turn sound off' : 'Turn sound on');
          soundToggle.setAttribute('aria-pressed', turnSoundOn ? 'true' : 'false');
          if (turnSoundOn) video.play().catch(function () {});
        });
      }

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !document.hidden) play(); else pause();
          });
        }, { threshold: 0.6 });
        observer.observe(video);
      }

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) pause();
      });
    });
  });
})();
