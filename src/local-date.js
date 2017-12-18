import {padLeft} from './utils';

const MILLISECONDS_IN_A_DAY = 86400000;

const NATIVE_DATE_DAY_INDEXES = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0,
};

function daysInFebruary(year) {
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        // Leap year
        return 29;
    } else {
        // Not a leap year
        return 28;
    }
}

function ensureIsLocalDate(date) {
    if (!date || date.constructor !== LocalDate) {
        throw new Error('Not a LocalDate: ' + date);
    }
}

/**
 * A time-free, timezone-free date value, similar to Java's LocalDate. Immutable.
 */
function LocalDate(dateString) {
    if (typeof dateString !== 'string' || dateString.length !== 10) {
        throw new Error('Invalid date given, should be a string, is: ' + dateString);
    }
    this.dateString = dateString;
    this.lazyNativeDate = undefined;
}

/**
 * @return {String} For example 'MONDAY'.
 */
LocalDate.prototype.getDayOfWeek = function() {
    const date = this.getNativeDateLazily();
    const dayIndex = date.getDay();
    for (let day in NATIVE_DATE_DAY_INDEXES) {
        if (NATIVE_DATE_DAY_INDEXES[day] === dayIndex) {
            return day;
        }
    }
    throw new Error('Unexpected day-of-week: ' + dayIndex);
};

/**
 * @return {String} For example 'Monday'.
 */
LocalDate.prototype.getPrettyDayOfWeek = function() {
    const day = this.getDayOfWeek();
    return day.substr(0, 1) + day.substr(1).toLowerCase().replace(/_/g, ' ');
};

LocalDate.prototype.addDays = function(days) {
    return this.getNewModifiedByDays(days);
};

LocalDate.prototype.minusDays = function(days) {
    return this.getNewModifiedByDays(-days);
};

LocalDate.prototype.getNewModifiedByDays = function(days) {
    const date = this.getNativeDateLazily();
    const modified = new Date(date.getTime());
    modified.setTime(modified.getTime() + (MILLISECONDS_IN_A_DAY * days));
    return LocalDate.of(modified);
};

/**
 * Make sure the returned value is cloned (or use `getDateClone()` instead).
 */
LocalDate.prototype.getNativeDateLazily = function() {
    if (this.lazyNativeDate) {
        return this.lazyNativeDate;
    }
    const parts = this.dateString.split('-');
    this.lazyNativeDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
        12,
        0
    );
    return this.lazyNativeDate;
};

LocalDate.prototype.toString = function() {
    return this.dateString;
};

/**
 * @return {Number}
 */
LocalDate.prototype.getYear = function() {
    return Number(this.dateString.substr(0, 4));
};

/**
 * @return {Number} In the range 1-12.
 */
LocalDate.prototype.getMonth = function() {
    return Number(this.dateString.substr(5, 2));
};

/**
 * @return {Number} In the range 1-31.
 */
LocalDate.prototype.getDayInMonth = function() {
    return Number(this.dateString.substr(8, 2));
};

/**
 * @return {Number} In the range 1-366.
 */
LocalDate.prototype.getDayInYear = function() {
    const feb = daysInFebruary(this.getYear());
    const aggregateMonths = [
        0, // January
        31, // February
        31 + feb, // March
        31 + feb + 31, // April
        31 + feb + 31 + 30, // May
        31 + feb + 31 + 30 + 31, // June
        31 + feb + 31 + 30 + 31 + 30, // July
        31 + feb + 31 + 30 + 31 + 30 + 31, // August
        31 + feb + 31 + 30 + 31 + 30 + 31 + 31, // September
        31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
        31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
        31 + feb + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
    ];
    return aggregateMonths[this.getMonth() - 1] + this.getDayInMonth();
};

LocalDate.prototype.isBefore = function(other) {
    ensureIsLocalDate(other);
    return this.toString() < other.toString();
};

LocalDate.prototype.isAfter = function(other) {
    ensureIsLocalDate(other);
    return this.toString() > other.toString();
};

LocalDate.prototype.isSame = function(other) {
    ensureIsLocalDate(other);
    return this.toString() === other.toString();
};

LocalDate.prototype.isBeforeOrEqual = function(other) {
    ensureIsLocalDate(other);
    return this.toString() <= other.toString();
};

LocalDate.prototype.isAfterOrEqual = function(other) {
    ensureIsLocalDate(other);
    return this.toString() >= other.toString();
};

/**
 * @param  {Array<String>} days E.g. [MONDAY, SUNDAY]
 * @return {Boolean}
 */
LocalDate.prototype.isAnyDayName = function(days) {
    return days.indexOf(this.getDayOfWeek()) !== -1;
};

/**
 * @return {Date}
 */
LocalDate.prototype.getDateClone = function() {
    return new Date(this.getNativeDateLazily().getTime());
};

/**
 * A year is a leap year if it is divisible by four without remainder.
 * However, years divisible by 100 are not leap years, with the exception of years divisible by 400 which are.
 *
 * @return {Boolean} True if the date is in a leap year.
 */
LocalDate.prototype.isLeapYear = function() {
    let year = this.getYear();
    if (year % 4 === 0) {
        if (year % 400 === 0) {
            return true;
        }
        if (year % 100 === 0) {
            console.log('x');
            return false;
        }
        return true;
    }
    return false;
};

LocalDate.today = function() {
    return LocalDate.of(new Date());
};

LocalDate.of = (date) => {
    if (date instanceof LocalDate) {
        return date;
    }

    if (typeof date === 'string') {
        return new LocalDate(date);
    }

    // Ensure the object is a date or a mock date. Can't check `date.constructor.name === 'Date'`
    // because `constructor.name` is undefined in IE.
    if (!date || typeof date.getFullYear !== 'function') {
        throw new Error(
            'Invalid date given, should be a Date object, is: ' + date +
            ', type: ' + typeof date +
            ', constructor: ' + (date.constructor && date.constructor.name ? date.constructor.name : null)
        );
    }

    return new LocalDate(
        (date.getFullYear()) +
        '-' +
        padLeft((date.getMonth() + 1), 2, '0') +
        '-' +
        padLeft(date.getDate(), 2, '0')
    );
};

export default LocalDate;
