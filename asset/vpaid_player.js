// vpaid_player.js
(function(window) {
  // VPAID creative object
  var VPAIDAd = function() {
    this.events = {};
    this.slot = null;
    this.videoSlot = null;
    this.width = 0;
    this.height = 0;
    this.expanded = false;
    this.skippableState = false;
  };

  /*** VPAID REQUIRED INTERFACE ***/

  VPAIDAd.prototype.handshakeVersion = function(version) {
    return '2.0';
  };

  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.width = width;
    this.height = height;
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
      var c = document.getElementById('vpaid-ad-container');
      if (c && c.parentNode) c.parentNode.removeChild(c);

      // Load test MP4 into video slot
      var testSrc = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
      this.videoSlot.src = testSrc;
      this.videoSlot.load();
      this.videoSlot.play();

      // Emit video start event
      this._emitEvent('AdVideoStart');

      // Listen for video end
      this.videoSlot.addEventListener('ended', function() {
        this._emitEvent('AdVideoComplete');
        this.stopAd();
      }.bind(this));
    }.bind(this));

    container.appendChild(input);
    container.appendChild(button);
    this.slot.appendChild(container);

    // Notify loaded
    this._emitEvent('AdLoaded');
  };

  VPAIDAd.prototype.startAd = function() {
    this._emitEvent('AdImpression');
    this._emitEvent('AdStarted');
  };

  VPAIDAd.prototype.stopAd = function() {
    var c = document.getElementById('vpaid-ad-container');
    if (c && c.parentNode) c.parentNode.removeChild(c);
    this._emitEvent('AdStopped');
  };

  VPAIDAd.prototype.pauseAd = function() {
    this.videoSlot && this.videoSlot.pause();
    this._emitEvent('AdPaused');
  };

  VPAIDAd.prototype.resumeAd = function() {
    this.videoSlot && this.videoSlot.play();
    this._emitEvent('AdPlaying');
  };

  VPAIDAd.prototype.expandAd = function() {
    this.expanded = true;
    this._emitEvent('AdExpandedChange');
  };

  VPAIDAd.prototype.collapseAd = function() {
    this.expanded = false;
    this._emitEvent('AdExpandedChange');
  };

  VPAIDAd.prototype.skipAd = function() {
    this._emitEvent('AdSkipped');
  };

  VPAIDAd.prototype.resizeAd = function(width, height, viewMode) {
    this.width = width;
    this.height = height;
    var c = document.getElementById('vpaid-ad-container');
    if (c) {
      c.style.width = width + 'px';
      c.style.height = height + 'px';
    }
    this._emitEvent('AdSizeChange');
  };

  /*** VPAID GETTERS & SETTERS ***/

  VPAIDAd.prototype.getAdDuration = function() {
    return this.videoSlot && this.videoSlot.duration ? this.videoSlot.duration : 0;
  };

  VPAIDAd.prototype.getAdRemainingTime = function() {
    if (!this.videoSlot || this.videoSlot.currentTime === undefined) return 0;
    return Math.max(0, (this.videoSlot.duration || 0) - this.videoSlot.currentTime);
  };

  VPAIDAd.prototype.getAdLinear = function() {
    // This is a linear video ad
    return true;
  };

  VPAIDAd.prototype.getAdExpanded = function() {
    return this.expanded;
  };

  VPAIDAd.prototype.getAdSkippableState = function() {
    return this.skippableState;
  };

  VPAIDAd.prototype.getAdVolume = function() {
    return this.videoSlot ? this.videoSlot.volume : 1;
  };

  VPAIDAd.prototype.setAdVolume = function(volume) {
    if (this.videoSlot) this.videoSlot.volume = volume;
  };

  VPAIDAd.prototype.getAdWidth = function() {
    return this.width;
  };

  VPAIDAd.prototype.getAdHeight = function() {
    return this.height;
  };

  VPAIDAd.prototype.getAdIcons = function() {
    return [];
  };

  /*** SUBSCRIBE/UNSUBSCRIBE ***/

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

  /*** INTERNAL ***/
  VPAIDAd.prototype._emitEvent = function(eventType) {
    (this.events[eventType] || []).forEach(function(cb) { cb(); });
  };

  // Expose factory
  window.getVPAIDAd = function() {
    return new VPAIDAd();
  };

})(window);
