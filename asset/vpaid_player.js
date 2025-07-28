// vpaid_player.js
(function(window) {
  // VPAID creative object
  function VPAIDAd() {
    this.events = {};
    this.slot = null;
    this.videoSlot = null;
    this.width = 0;
    this.height = 0;
    this.expanded = false;
    this.skippableState = false;
  }

  /*** VPAID REQUIRED INTERFACE ***/
  VPAIDAd.prototype.handshakeVersion = function(version) {
    return '2.0';
  };

  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.width = width;
    this.height = height;
    this.slot = environmentVars.slot || environmentVars.adSlot;
    this.videoSlot = environmentVars.videoSlot;

    // Emit AdLoaded asynchronously so wrapper can subscribe first
    setTimeout(function() {
      this._emitEvent('AdLoaded');
    }.bind(this), 0);

    // Create interactive container
    var container = document.createElement('div');
    container.id = 'vpaid-ad-container';
    Object.assign(container.style, {
      position: 'absolute', top: '0', left: '0',
      width: width + 'px', height: height + 'px', zIndex: '9999',
      backgroundSize: 'cover', backgroundImage: 'url(http://background.jpg)'
    });

    // Input prompt
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
      if (container.parentNode) container.parentNode.removeChild(container);

      // Load test MP4
      var testSrc = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
      this.videoSlot.src = testSrc;
      this.videoSlot.load();
      this.videoSlot.play();

      this._emitEvent('AdVideoStart');
      this.videoSlot.addEventListener('ended', function() {
        this._emitEvent('AdVideoComplete');
        this.stopAd();
      }.bind(this));
    }.bind(this));

    container.appendChild(input);
    container.appendChild(button);
    if (this.slot) this.slot.appendChild(container);
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
    if (this.videoSlot) this.videoSlot.pause();
    this._emitEvent('AdPaused');
  };

  VPAIDAd.prototype.resumeAd = function() {
    if (this.videoSlot) this.videoSlot.play();
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

  VPAIDAd.prototype.resizeAd = function(width, height) {
    this.width = width;
    this.height = height;
    var c = document.getElementById('vpaid-ad-container');
    if (c) {
      c.style.width = width + 'px';
      c.style.height = height + 'px';
    }
    this._emitEvent('AdSizeChange');
  };

  /*** GETTERS/SETTERS ***/
  VPAIDAd.prototype.getAdDuration = function() {
    return this.videoSlot && this.videoSlot.duration ? this.videoSlot.duration : 0;
  };
  VPAIDAd.prototype.getAdRemainingTime = function() {
    if (!this.videoSlot || typeof this.videoSlot.currentTime !== 'number') return 0;
    return Math.max(0, (this.videoSlot.duration || 0) - this.videoSlot.currentTime);
  };
  VPAIDAd.prototype.getAdLinear = function() { return true; };
  VPAIDAd.prototype.getAdExpanded = function() { return this.expanded; };
  VPAIDAd.prototype.getAdSkippableState = function() { return this.skippableState; };
  VPAIDAd.prototype.getAdWidth = function() { return this.width; };
  VPAIDAd.prototype.getAdHeight = function() { return this.height; };
  VPAIDAd.prototype.getAdVolume = function() { return this.videoSlot ? this.videoSlot.volume : 1; };
  VPAIDAd.prototype.setAdVolume = function(v) { if (this.videoSlot) this.videoSlot.volume = v; };
  VPAIDAd.prototype.getAdIcons = function() { return []; };
  VPAIDAd.prototype.getAdCompanions = function() { return ''; };

  /*** OVERRIDDEN SUBSCRIBE ***/ & UNSUBSCRIBE ***/
  VPAIDAd.prototype.subscribe = function(arg1, arg2, arg3) {
    var eventType, callback, context;
    // wrapper-style: subscribe(callback, eventName, context)
    if (typeof arg1 === 'function' && typeof arg2 === 'string') {
      callback  = arg1;
      eventType = arg2;
      context   = arg3 || this;
    } else {
      // creative-style: subscribe(eventType, callback)
      eventType = arg1;
      callback  = arg2;
      context   = this;
    }
    this.events[eventType] = this.events[eventType] || [];
    this.events[eventType].push(callback.bind(context));
  };

  VPAIDAd.prototype.unsubscribe = function(arg1, arg2, arg3) {
    var eventType, callback;
    if (typeof arg1 === 'function' && typeof arg2 === 'string') {
      callback  = arg1;
      eventType = arg2;
    } else {
      eventType = arg1;
      callback  = arg2;
    }
    var handlers = this.events[eventType] || [];
    for (var i = handlers.length - 1; i >= 0; i--) {
      // compare original callback reference
      if (handlers[i] === callback) handlers.splice(i, 1);
    }
  };

  /*** INTERNAL ***/
  VPAIDAd.prototype._emitEvent = function(eventType) {
    (this.events[eventType] || []).forEach(function(fn) { fn(); });
  };

  // Expose factory
  window.getVPAIDAd = function() { return new VPAIDAd(); };
})(window);
