/**
 * Created by ken on 14/11/2016.
 */
/**
 *
 * @constructor
 */
function SnapAnimationQueue() {
    this.animationQueue = [];
    this._totalDuration = 0;
    this._startTime = null;
    this._lapsedTime = null;
    this._timerForComplete = null;
    this.onCompleteCallback = null;

    this.defaultOptions = {
        easing: mina.easeinout,
        delay: 0,
        callback: null
    };
}

/**
 * Adding a new animation to the queue
 * @param elem Snap
 * @param duration {int}
 * @param attrs {object}
 * @param easing {null|easing}
 * @param delay {null|int}
 * @param callbackFn
 * @returns {SnapAnimationQueue}
 */
SnapAnimationQueue.prototype.add = function (elem, duration, attrs, easing, delay, callbackFn) {
    if(!elem || typeof attrs != 'object') return this;
    easing = easing || this.defaultOptions.easing;

    var newDelay;

    if(typeof delay == 'string')
    {
        var operator = delay.substring(0,2);

        if(operator == '-=') {
            newDelay = parseFloat(this._totalDuration) - parseFloat(delay.substring(2));
            newDelay = (newDelay < 0) ? 0 : newDelay;
        }
        else if(operator == '+=') {
            newDelay = parseFloat(this._totalDuration) + parseFloat(delay.substring(2));
        }
        else {
            newDelay = parseFloat(delay);
        }
    }
    else if(typeof delay == 'undefined') {
        newDelay = this._totalDuration;
    }
    else {
        newDelay = delay;
    }

    var timeout = window.setTimeout(function(){
        elem.animate(attrs, duration, easing, callbackFn);
    },newDelay);

    this._computeDuration(duration, delay);
    this.animationQueue.push({
        elem: elem,
        duration: duration,
        startingTime: newDelay,
        timeout: timeout
    });

    //console.log(this._lapsedTime);
    return this;
};

/**
 * Compute the total duration of the queue
 * @param duration
 * @param delay
 * @private
 */
SnapAnimationQueue.prototype._computeDuration = function (duration, delay) {

    // If it's a first add
    if(!this._startTime) {
        this._startTime = Date.now();
    }

    this._lapsedTime = Date.now() - this._startTime;
    var newDuration;

    if(typeof delay == 'string')
    {
        var operator = delay.substring(0,2);

        if(operator == '-=') {
            newDuration = parseFloat(this._totalDuration) - parseFloat(delay.substring(2));
            newDuration = (newDuration < 0) ? 0 : newDuration;
            newDuration += duration;
        }
        else if(operator == '+=') {
            newDuration = parseFloat(this._totalDuration) + parseFloat(delay.substring(2));
            newDuration += duration;
        }
        else {
            newDuration = Math.max(parseFloat(delay)+duration, this._totalDuration);
        }
    }
    else if(typeof delay == 'undefined') {
        newDuration = this._totalDuration + duration;
    }
    else {
        newDuration = Math.max(parseFloat(delay)+duration, this._totalDuration);
    }

    this._totalDuration = newDuration;

    var leavingTime = Math.abs(this._totalDuration - this._lapsedTime);
    this._setOnCompleteTimer(leavingTime);
};

/**
 * Intern setting when animations ended
 */
SnapAnimationQueue.prototype.whenAnimationsEnded = function () {
    this.animationQueue = [];
    this._totalDuration = 0;
    this._startTime = null;
    this._lapsedTime = null;
    this._timerForComplete = null;
    this.onCompleteCallback = null;
};

SnapAnimationQueue.prototype._setOnCompleteTimer = function (delay) {
    var self = this;
    if(this._timerForComplete) {
        window.clearTimeout(this._timerForComplete);
        this._timerForComplete= null;
    }

    this._timerForComplete = window.setTimeout(function(){
        if(typeof self.onCompleteCallback == 'function') self.onCompleteCallback(self);
        self.whenAnimationsEnded();
    }, delay);
};