// vpaid_player.js
(function(window) {
  // VPAID creative object
  var VPAIDAd = function() {
    // VPAID-defined events
    this.events = {};
    this.assets = {};
    this.slot = null;
    this.videoSlot = null;
    this.attributes = {
      companionSlots: []
    };
    this.startTime = null;
  };

  /*** VPAID METHODS ***/

  VPAIDAd.prototype.handshakeVersion = function(version) {
    // Returns the supported VPAID version
    return '2.0';
  };

  VPAIDAd.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    // Save slot references
    this.slot = environmentVars.adSlot;
    this.videoSlot = environmentVars.videoSlot;

    // Create a container div for the ad UI
    var container = document.createElement('div');
    container.id = 'vpaid-ad-container';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.zIndex = '9999';
    container.style.backgroundSize = 'cover';
    container.style.backgroundImage = 'url(http://background.jpg)';

    // Create input box
    var input = document.createElement('textarea');
    input.id = 'vpaid-input';
    input.placeholder = 'Describe your perfect burger';
    input.style.width = '80%';
    input.style.margin = '20px auto';
    input.style.display = 'block';

    // Create submit button
    var button = document.createElement('button');
    button.textContent = 'Submit';
    button.style.display = 'block';
    button.style.margin = '10px auto';

    button.addEventListener('click', function() {
      var prompt = input.value;
      if (!prompt) return;
      // Fire API call as GET with user_prompt param
      var url = 'https://imaginer.api/endpoint?user_prompt=' + encodeURIComponent(prompt);
      fetch(url, { method: 'GET' })
        .then(function(response) {
          // After API call completes, signal ad complete
          this._emitEvent('AdVideoComplete');
          this.stopAd();
        }.bind(this))
        .catch(function(err) {
          console.error('API call failed', err);
          this.stopAd();
        }.bind(this));
    }.bind(this));

    container.appendChild(input);
    container.appendChild(button);
    this.slot.appendChild(container);

    // Notify the ad unit is loaded
    this._emitEvent('AdLoaded');
  };

  VPAIDAd.prototype.startAd = function() {
    // Ad has started, emit impression and start events
    this._emitEvent('AdImpression');
    this._emitEvent('AdStarted');
    this._emitEvent('AdVideoStart');
  };

  VPAIDAd.prototype.stopAd = function() {
    // Remove container UI
    var container = document.getElementById('vpaid-ad-container');
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    this._emitEvent('AdStopped');
  };

  VPAIDAd.prototype.skipAd = function() {
    this._emitEvent('AdSkipped');
  };

  VPAIDAd.prototype.resizeAd = function(width, height, viewMode) {
    var container = document.getElementById('vpaid-ad-container');
    if (container) {
      container.style.width = width + 'px';
      container.style.height = height + 'px';
    }
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

  /*** INTERNAL ***/
  VPAIDAd.prototype._emitEvent = function(eventType) {
    var handlers = this.events[eventType] || [];
    handlers.forEach(function(cb) { cb(); });
  };

  // Expose getVPAIDAd
  window.getVPAIDAd = function() {
    return new VPAIDAd();
  };

})(window);
