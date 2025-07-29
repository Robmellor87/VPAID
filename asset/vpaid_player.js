// VPAIDWrapper.js

var VPAIDWrapper = function (VPAIDCreative) {
  this._creative = VPAIDCreative;
  if (!this.checkVPAIDInterface(VPAIDCreative)) {
    console.error("VPAIDCreative doesn't conform to the VPAID spec");
    return;
  }
  this.setCallbacksForCreative();
};

VPAIDWrapper.prototype.checkVPAIDInterface = function (creative) {
  return !!(creative.handshakeVersion && typeof creative.handshakeVersion === 'function' &&
    creative.initAd      && typeof creative.initAd      === 'function' &&
    creative.startAd     && typeof creative.startAd     === 'function' &&
    creative.stopAd      && typeof creative.stopAd      === 'function' &&
    creative.skipAd      && typeof creative.skipAd      === 'function' &&
    creative.resizeAd    && typeof creative.resizeAd    === 'function' &&
    creative.pauseAd     && typeof creative.pauseAd     === 'function' &&
    creative.resumeAd    && typeof creative.resumeAd    === 'function' &&
    creative.expandAd    && typeof creative.expandAd    === 'function' &&
    creative.collapseAd  && typeof creative.collapseAd  === 'function' &&
    creative.subscribe   && typeof creative.subscribe   === 'function' &&
    creative.unsubscribe && typeof creative.unsubscribe === 'function');
};

VPAIDWrapper.prototype.setCallbacksForCreative = function () {
  var callbacks = {
    AdLoaded:                 this.onAdLoaded,
    AdStarted:                this.onStartAd,
    AdImpression:             this.onAdImpression,
    AdVideoStart:             this.onAdVideoStart,
    AdVideoFirstQuartile:     this.onAdVideoFirstQuartile,
    AdVideoMidpoint:          this.onAdVideoMidpoint,
    AdVideoThirdQuartile:     this.onAdVideoThirdQuartile,
    AdVideoComplete:          this.onAdVideoComplete,
    AdPaused:                 this.onAdPaused,
    AdPlaying:                this.onAdPlaying,
    AdStopped:                this.onStopAd,
    AdSkipped:                this.onSkipAd,
    AdError:                  this.onAdError,
    AdSizeChange:             this.onAdSizeChange,
    AdExpandedChange:         this.onAdExpandedChange,
    AdSkippableStateChange:   this.onAdSkippableStateChange,
    AdDurationChange:         this.onAdDurationChange,
    AdRemainingTimeChange:    this.onAdRemainingTimeChange,
    AdVolumeChange:           this.onAdVolumeChange,
    AdClickThru:              this.onAdClickThru,
    AdInteraction:            this.onAdInteraction,
    AdUserAcceptInvitation:   this.onAdUserAcceptInvitation,
    AdUserMinimize:           this.onAdUserMinimize,
    AdUserClose:              this.onAdUserClose,
    AdLog:                    this.onAdLog,
    AdLinearChange:           this.onAdLinearChange
  };

  // Use the creative's subscribe(eventType, callback) signature:
  for (var eventName in callbacks) {
    this._creative.subscribe(
      eventName,
      callbacks[eventName].bind(this)
    );
  }
};

// Pass-throughs
VPAIDWrapper.prototype.initAd = function (w, h, vm, db, cd, env) {
  this._creative.initAd(w, h, vm, db, cd, env);
};
VPAIDWrapper.prototype.startAd = function () {
  console.log('startAd');
  this._creative.startAd();
};
VPAIDWrapper.prototype.pauseAd = function () { this._creative.pauseAd(); };
VPAIDWrapper.prototype.resumeAd = function () { this._creative.resumeAd(); };
VPAIDWrapper.prototype.expandAd = function () { this._creative.expandAd(); };
VPAIDWrapper.prototype.collapseAd = function () { this._creative.collapseAd(); };
VPAIDWrapper.prototype.skipAd = function () { this._creative.skipAd(); };
VPAIDWrapper.prototype.stopAd = function () { this._creative.stopAd(); };
VPAIDWrapper.prototype.resizeAd = function (w, h, vm) { this._creative.resizeAd(w, h, vm); };
VPAIDWrapper.prototype.setAdVolume = function (v) { this._creative.setAdVolume(v); };
VPAIDWrapper.prototype.getAdVolume = function () { return this._creative.getAdVolume(); };
VPAIDWrapper.prototype.getAdExpanded = function () { return this._creative.getAdExpanded(); };
VPAIDWrapper.prototype.getAdSkippableState = function () { return this._creative.getAdSkippableState(); };
VPAIDWrapper.prototype.getAdLinear = function () { return this._creative.getAdLinear(); };
VPAIDWrapper.prototype.getAdRemainingTime = function () { return this._creative.getAdRemainingTime(); };
VPAIDWrapper.prototype.getAdDuration = function () { return this._creative.getAdDuration(); };
VPAIDWrapper.prototype.getAdWidth = function () { return this._creative.getAdWidth(); };
VPAIDWrapper.prototype.getAdHeight = function () { return this._creative.getAdHeight(); };

// Event callbacks
VPAIDWrapper.prototype.onAdLoaded = function () {
  console.log('ad has been loaded');
};
VPAIDWrapper.prototype.onStartAd = function () {
  console.log('Ad has started');
};
VPAIDWrapper.prototype.onAdImpression = function () {
  console.log('Ad Impression');
};
VPAIDWrapper.prototype.onAdVideoStart = function () {
  console.log('Video 0% completed');
};
VPAIDWrapper.prototype.onAdVideoFirstQuartile = function () {
  console.log('Video 25% completed');
};
VPAIDWrapper.prototype.onAdVideoMidpoint = function () {
  console.log('Video 50% completed');
};
VPAIDWrapper.prototype.onAdVideoThirdQuartile = function () {
  console.log('Video 75% completed');
};
VPAIDWrapper.prototype.onAdVideoComplete = function () {
  console.log('Video 100% completed');
};
VPAIDWrapper.prototype.onAdPaused = function () {
  console.log('onAdPaused');
};
VPAIDWrapper.prototype.onAdPlaying = function () {
  console.log('onAdPlaying');
};
VPAIDWrapper.prototype.onSkipAd = function () {
  console.log('Ad was skipped');
};
VPAIDWrapper.prototype.onStopAd = function () {
  console.log('Ad has stopped');
};
VPAIDWrapper.prototype.onAdError = function (msg) {
  console.log('onAdError: ' + msg);
};
VPAIDWrapper.prototype.onAdLog = function (msg) {
  console.log('onAdLog: ' + msg);
};
VPAIDWrapper.prototype.onAdSizeChange = function () {
  console.log('Ad size changed to: w=' + this.getAdWidth() + ' h=' + this.getAdHeight());
};
VPAIDWrapper.prototype.onAdExpandedChange = function () {
  console.log('Ad Expanded Changed to: ' + this.getAdExpanded());
};
VPAIDWrapper.prototype.onAdSkippableStateChange = function () {
  console.log('Ad Skippable State Changed to: ' + this.getAdSkippableState());
};
VPAIDWrapper.prototype.onAdDurationChange = function () {
  console.log('Ad Duration Changed to: ' + this.getAdDuration());
};
VPAIDWrapper.prototype.onAdRemainingTimeChange = function () {
  console.log('Ad Remaining Time Changed to: ' + this.getAdRemainingTime());
};
VPAIDWrapper.prototype.onAdVolumeChange = function () {
  console.log('Ad Volume has changed to - ' + this.getAdVolume());
};
VPAIDWrapper.prototype.onAdClickThru = function (url, id, hc) {
  console.log('Clickthrough portion of the ad was clicked:', url);
};
VPAIDWrapper.prototype.onAdInteraction = function (id) {
  console.log('A non-clickthrough event has occurred:', id);
};
VPAIDWrapper.prototype.onAdUserAcceptInvitation = function () {
  console.log('AdUserAcceptInvitation');
};
VPAIDWrapper.prototype.onAdUserMinimize = function () {
  console.log('AdUserMinimize');
};
VPAIDWrapper.prototype.onAdUserClose = function () {
  console.log('AdUserClose');
};
VPAIDWrapper.prototype.onAdLinearChange = function () {
  console.log('Ad linear has changed: ' + this.getAdLinear());
};

// Usage example:
// var wrapper = new VPAIDWrapper(window.getVPAIDAd());
// wrapper.initAd(640, 360, 'normal', 500, creativeData, { slot: adSlotElement, videoSlot: videoElement });
