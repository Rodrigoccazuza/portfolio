(function () {
  'use strict';
  var dialog = document.getElementById('media-viewer');
  if (!dialog) return;

  var stage = dialog.querySelector('.media-viewer-stage');
  var viewport = dialog.querySelector('.media-viewer-viewport');
  var title = dialog.querySelector('#media-viewer-title');
  var count = dialog.querySelector('#media-viewer-count');
  var tools = dialog.querySelector('.media-viewer-tools');
  var collection = [];
  var currentIndex = 0;
  var scale = 1;
  var offsetX = 0;
  var offsetY = 0;
  var dragging = false;
  var startX = 0;
  var startY = 0;
  var returnFocus = null;

  function current() { return collection[currentIndex] || {}; }
  function isVideo(item) { return item.type === 'video' || /\.(mp4|m4v|webm)(\?|$)/i.test(item.src || ''); }
  function imageElement() { return stage.querySelector('img'); }
  function updateTransform() {
    var image = imageElement();
    if (!image) return;
    var maxX = Math.max(0, ((image.offsetWidth * scale) - viewport.clientWidth) / 2 + 24);
    var maxY = Math.max(0, ((image.offsetHeight * scale) - viewport.clientHeight) / 2 + 24);
    offsetX = Math.min(maxX, Math.max(-maxX, offsetX));
    offsetY = Math.min(maxY, Math.max(-maxY, offsetY));
    image.style.transform = 'translate3d(' + offsetX + 'px,' + offsetY + 'px,0) scale(' + scale + ')';
    viewport.classList.toggle('is-zoomed', scale > 1);
  }
  function reset() { scale = 1; offsetX = 0; offsetY = 0; updateTransform(); }
  function zoom(delta) {
    if (!imageElement()) return;
    scale = Math.min(5, Math.max(1, scale + delta));
    if (scale === 1) { offsetX = 0; offsetY = 0; }
    updateTransform();
  }
  function render() {
    var item = current();
    stage.textContent = '';
    title.textContent = item.title || item.alt || 'Selected work';
    count.textContent = collection.length > 1 ? (currentIndex + 1) + ' / ' + collection.length : '';
    reset();
    tools.classList.toggle('is-video', isVideo(item));
    if (isVideo(item)) {
      var video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('aria-label', item.alt || item.title || 'Portfolio video');
      stage.appendChild(video);
    } else {
      var image = document.createElement('img');
      image.src = item.src;
      image.alt = item.alt || item.title || '';
      image.draggable = false;
      stage.appendChild(image);
    }
    Array.prototype.forEach.call(dialog.querySelectorAll('.media-viewer-nav'), function (button) { button.hidden = collection.length < 2; });
  }
  function navigate(direction) {
    if (collection.length < 2) return;
    currentIndex = (currentIndex + direction + collection.length) % collection.length;
    render();
  }
  function close() {
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    dialog.close();
  }
  function open(items, index, trigger) {
    collection = (items || []).filter(function (item) { return item && item.src; });
    if (!collection.length) return;
    currentIndex = Math.min(Math.max(index || 0, 0), collection.length - 1);
    returnFocus = trigger || document.activeElement;
    render();
    dialog.showModal();
    dialog.querySelector('[data-viewer-action="close"]').focus();
  }
  function action(name) {
    if (name === 'close') close();
    if (name === 'previous') navigate(-1);
    if (name === 'next') navigate(1);
    if (name === 'zoom-in') zoom(.25);
    if (name === 'zoom-out') zoom(-.25);
    if (name === 'reset') reset();
    if (name === 'fullscreen' && !document.fullscreenElement && dialog.requestFullscreen) dialog.requestFullscreen().catch(function () {});
    else if (name === 'fullscreen' && document.exitFullscreen) document.exitFullscreen();
  }

  dialog.addEventListener('click', function (event) {
    var button = event.target.closest('[data-viewer-action]');
    if (button) action(button.dataset.viewerAction);
    else if (event.target === dialog) close();
  });
  dialog.addEventListener('close', function () { stage.textContent = ''; if (returnFocus && returnFocus.focus) returnFocus.focus(); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      var focusable = Array.prototype.slice.call(dialog.querySelectorAll('button:not([hidden]), video'));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  viewport.addEventListener('wheel', function (event) {
    if (!imageElement()) return;
    event.preventDefault();
    zoom(event.deltaY < 0 ? .2 : -.2);
  }, { passive: false });
  viewport.addEventListener('pointerdown', function (event) {
    if (scale <= 1 || !imageElement()) return;
    dragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;
    updateTransform();
  });
  viewport.addEventListener('pointerup', function () { dragging = false; });
  viewport.addEventListener('pointercancel', function () { dragging = false; });
  window.addEventListener('resize', updateTransform);

  window.PortfolioMediaViewer = { open: open, close: close };
}());
