// vpaid_player.js
(function(window) {
  // VPAID creative object
  var VPAIDAd = function() {
    // VPAID-defined events
    this.events = {};
    this.slot = null;
    this.videoSlot = null;
  };

  /*** VPAID METHODS ***/

  VPAIDAd.prototype.handshakeVersion = function(version) {
    return '2.0';
  };

  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.slot = environmentVars.adSlot;
    this.videoSlot = environmentVars.videoSlot;

    // Container for interactive UI
    var container = document.createElement('div');
    container.id = 'vpaid-ad-container';
    Object.assign(container.style, {
      position: 'absolute', top: '0', left: '0',
      width: width + 'px', height: height + 'px', zIndex: '9999',
      backgroundSize: 'cover', backgroundImage: 'url(http://background.jpg)'
    });

    // Input field
    var input = document.createElement('textarea');
    input.id = 'vpaid-input';
    input.placeholder = 'Describe your perfect burger';
    Object.assign(input.style, { width: '80%', margin: '20px auto', display: 'block' });

    // Submit button
    var button = document.createElement('button');
    button.textContent = 'Submit';
    Object.assign(button.style, { display: 'block', margin: '10px auto' });

    button.addEventListener('click', function() {
      if (!input.value) return;
      // Remove interactive overlay
      container.parentNode.removeChild(container);

      // Load test MP4 into video slot
      var testSrc = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
      this.videoSlot.src = testSrc;
      this.videoSlot.load();
      this.videoSlot.play();

      // Emit video start event
      this._emitEvent('AdVideoStart');

      // When video ends, emit complete and stop
      this.videoSlot.addEventListener('ended', function() {
        this._emitEvent('AdVideoComplete');
        this.stopAd();
      }.bind(this));
    }.bind(this));

    container.appendChild(input);
    container.appendChild(button);
    this.slot.appendChild(container);

    this._emitEvent('AdLoaded');
  };

  VPAIDAd.prototype.startAd = function() {
    this._emitEvent('AdImpression');
    this._emitEvent('AdStarted');
  };

  VPAIDAd.prototype.stopAd = function() {
    // Clean-up container if still present
    var c = document.getElementById('vpaid-ad-container');
    if (c && c.parentNode) c.parentNode.removeChild(c);
    this._emitEvent('AdStopped');
  };

  VPAIDAd.prototype.skipAd = function() {
    this._emitEvent('AdSkipped');
  };

  VPAIDAd.prototype.resizeAd = function(width, height) {
    var c = document.getElementById('vpaid-ad-container');
    if (c) { c.style.width = width + 'px'; c.style.height = height + 'px'; }
    this._emitEvent('AdSizeChange');
  };

  VPAIDAd.prototype.pauseAd = function() {
    this._emitEvent('AdPaused');
  };

  VPAIDAd.prototype.resumeAd = function() {
    this._emitEvent('AdPlaying');
  };

  VPAIDAd.prototype.expandAd = function() {
    this._emitEvent('AdExpandedChange');
  };

  VPAIDAd.prototype.collapseAd = function() {
    this._emitEvent('AdExpandedChange');
  };

  VPAIDAd.prototype.subscribe = function(eventType, callback) {
    this.events[eventType] = this.events[eventType] || [];
    this.events[eventType].push(callback);
  };

  VPAIDAd.prototype.unsubscribe = function(eventType, callback) {
    var handlers = this.events[eventType] || [];
    for (var i = handlers.length - 1; i >= 0; i--) {
      if (handlers[i] === callback) handlers.splice(i, 1);
    }
  };

  VPAIDAd.prototype._emitEvent = function(eventType) {
    (this.events[eventType] || []).forEach(function(cb) { cb(); });
  };

  window.getVPAIDAd = function() {
    return new VPAIDAd();
  };

})(window);
