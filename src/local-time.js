import {padLeft} from './utils';

/**
 * A timezone-free time value, similar to Java's LocalTime. Immutable.
 */
function LocalTime(timeString) {
    if (typeof timeString !== 'string' || timeString.length !== 5) {
        throw new Error('Invalid time given, should be a string, is: ' + timeString);
    }
    this.timeString = timeString;
}

function ensureIsLocalTime(time) {
    if (!time || time.constructor !== LocalTime) {
        throw new Error('Not a LocalTime: ' + time);
    }
}

/**
 * @return {Date}
 */
LocalTime.prototype.toDateObject = function() {
    const parts = this.timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(parts[0]);
    date.setMinutes(parts[1]);
    return date;
};

/**
 * @return {Number}
 */
LocalTime.prototype.getHours = function() {
    return Number(this.timeString.split(':')[0]);
};

/**
 * @return {Number}
 */
LocalTime.prototype.getMinutes = function() {
    return Number(this.timeString.split(':')[1]);
};

/**
 * @return {Date}
 */
LocalTime.prototype.toString = function() {
    return this.timeString;
};

LocalTime.prototype.addHours = function(hours) {
    return this.getNewModifiedByHours(hours);
};

LocalTime.prototype.minusHours = function(hours) {
    return this.getNewModifiedByHours(-hours);
};

LocalTime.prototype.getNewModifiedByHours = function(delta) {
    const newHours = this.getHours() + delta;
    if (newHours < 0 || newHours > 24) {
        throw new Error('Cannot modify hours by ' + delta + ' when time is ' + this.toString() + ' - would be out of bounds');
    }

    const newString = padLeft(newHours, 2, '0') + ':' + padLeft(this.getMinutes(), 2, '0');
    return new LocalTime(newString);
};

LocalTime.prototype.addMinutes = function(minutes) {
    return this.getNewModifiedByMinutes(minutes);
};

LocalTime.prototype.minusMinutes = function(minutes) {
    return this.getNewModifiedByMinutes(-minutes);
};

LocalTime.prototype.getNewModifiedByMinutes = function(delta) {
    let newMinutes = this.getMinutes() + delta;
    let newHours = this.getHours();

    while (newMinutes < 0) {
        newHours -= 1;
        newMinutes += 60;
    }
    while (newMinutes >= 60) {
        newHours += 1;
        newMinutes -= 60;
    }

    const newString = padLeft(newHours, 2, '0') +
        ':' +
        padLeft(newMinutes, 2, '0');
    return new LocalTime(newString);
};

LocalTime.prototype.isSame = function(other) {
    ensureIsLocalTime(other);
    return this.timeString === other.timeString;
};

LocalTime.prototype.isSameHour = function(other) {
    ensureIsLocalTime(other);
    return this.getHours() === other.getHours();
};

LocalTime.prototype.isBefore = function(other) {
    return this.toNumber() < other.toNumber();
};

LocalTime.prototype.isAfter = function(other) {
    return this.toNumber() > other.toNumber();
};

/**
 * @return {Number} E.g. 2230 for 10:30pm, or 900 for 9am.
 */
LocalTime.prototype.toNumber = function() {
    return parseInt(this.timeString.replace(':', ''), 10);
};

/**
 * @param  {LocalTime} other
 * @return {Number}    -1, 0 or 1.
 */
LocalTime.prototype.compareTo = function(other) {
    ensureIsLocalTime(other);
    return this.isBefore(other) ? -1 : (this.isSame(other) ? 0 : 1);
};

/**
 * @return {LocalTime}
 */
LocalTime.of = function(value) {
    if (value instanceof Date) {
        const string = padLeft(value.getHours(), 2, '0') + ':' + padLeft(value.getMinutes(), 2, '0');
        return new LocalTime(string);
    } else if (typeof value === 'string') {
        return new LocalTime(value);
    } else if (value instanceof LocalTime) {
        return value;
    } else if (typeof value === 'object' && typeof value.hours !== 'undefined' && typeof value.minutes !== 'undefined') {
        const string = padLeft(value.hours, 2, '0') + ':' + padLeft(value.minutes, 2, '0');
        return new LocalTime(string);
    } else {
        throw new Error('Unexpected value: ' + value);
    }
};

/**
 * @return {LocalTime}
 */
LocalTime.now = function() {
    return LocalTime.of(new Date());
};

/**
 * @return {LocalTime}
 */
LocalTime.prototype.goToStartOfHour = function() {
    return new LocalTime(
        padLeft(this.getHours(), 2, '0') + ':00'
    );
};

/**
 * @return {LocalTime}
 */
LocalTime.prototype.goToEndOfHour = function() {
    return new LocalTime(
        padLeft(this.getHours() + 1, 2, '0') + ':00'
    );
};

/**
 * @return {Number}
 */
LocalTime.prototype.getDifferenceInMinutes = function(other) {
    ensureIsLocalTime(other);

    const thisMinutes = this.getHours() * 60 + this.getMinutes();
    const otherMinutes = other.getHours() * 60 + other.getMinutes();
    if (thisMinutes === otherMinutes) {
        return 0;
    } else if (thisMinutes < otherMinutes) {
        return otherMinutes - thisMinutes;
    } else if (thisMinutes > otherMinutes) {
        return thisMinutes - otherMinutes;
    } else {
        throw new Error('getDifferenceInMinutes had unexpected branch: ' + thisMinutes + ', ' + otherMinutes);
    }
};

const halfHourRegex = /:[03]0$/;

/**
 * @return {Boolean} True if the time is on the hour or at 30 minutes past the hour.
 *                   False otherwise.
 */
LocalTime.prototype.isFullOrHalfHour = function() {
    return halfHourRegex.test(this.timeString);
};

export default LocalTime;
