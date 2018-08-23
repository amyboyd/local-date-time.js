const chai = require('chai');
const expect = chai.expect;

const LocalDate = require('../dist/test-bundle.js').LocalDate;

describe('LocalDate', function() {
    it('should have a property called dateString', function() {
        expect(LocalDate.today().dateString).to.match(/^201[789]-[012]\d-[0123]\d$/);
    });

    it('should have a minusDays method', function() {
        const startDate = new LocalDate('2016-05-23');

        const twoDaysAgo = startDate.minusDays(2);
        expect(twoDaysAgo.dateString).to.equal('2016-05-21');

        const thirtyDaysAgo = startDate.minusDays(30);
        expect(thirtyDaysAgo.dateString).to.equal('2016-04-23');

        const twoHundredDaysAgo = startDate.minusDays(200);
        expect(twoHundredDaysAgo.dateString).to.equal('2015-11-05');
    });

    it('should have an addDays method', function() {
        const startDate = new LocalDate('2016-05-23');

        const twoDaysFromNow = startDate.addDays(2);
        expect(twoDaysFromNow.dateString).to.equal('2016-05-25');

        const thirtyDaysFromNow = startDate.addDays(30);
        expect(thirtyDaysFromNow.dateString).to.equal('2016-06-22');
    });

    it('should have an getDayOfWeek method', function() {
        const monday = new LocalDate('2016-09-05');
        expect(monday.getDayOfWeek()).to.equal('MONDAY');

        const wednesday = new LocalDate('2016-09-07');
        expect(wednesday.getDayOfWeek()).to.equal('WEDNESDAY');

        const sunday = new LocalDate('2016-09-11');
        expect(sunday.getDayOfWeek()).to.equal('SUNDAY');
    });

    it('should have an getPrettyDayOfWeek method', function() {
        const monday = new LocalDate('2016-09-05');
        expect(monday.getPrettyDayOfWeek()).to.equal('Monday');

        const wednesday = new LocalDate('2016-09-07');
        expect(wednesday.getPrettyDayOfWeek()).to.equal('Wednesday');

        const sunday = new LocalDate('2016-09-11');
        expect(sunday.getPrettyDayOfWeek()).to.equal('Sunday');
    });

    it('should have a toString method', function() {
        const date = new LocalDate('2016-05-23');
        expect(date + '').to.equal('2016-05-23');
    });

    describe('isAfter', function() {
        it('should return true', function() {
            expect(new LocalDate('2015-05-24').isAfter(new LocalDate('2015-05-23'))).to.equal(true);
        });

        it('should throw when given a Date', function() {
            expect(() => new LocalDate('2015-05-24').isAfter(new Date())).to.throw();
        });
    });

    describe('isAnyDayName', function() {
        it('should return true', function() {
            expect(new LocalDate('2016-09-07').isAnyDayName(['MONDAY', 'WEDNESDAY'])).to.equal(true);
        });

        it('should return false', function() {
            expect(new LocalDate('2016-09-07').isAnyDayName(['MONDAY', 'TUESDAY'])).to.equal(false);
            expect(new LocalDate('2016-09-07').isAnyDayName([])).to.equal(false);
        });
    });

    describe('isLeapYear', function() {
        function expectTrue(date) {
            expectBoolean(date, true);
        }

        function expectFalse(date) {
            expectBoolean(date, false);
        }

        function expectBoolean(date, expected) {
            expect(new LocalDate(date).isLeapYear()).to.equal(expected);
        }

        it('should return false for years not divisible by 4', function() {
            expectFalse('2017-01-01');
        });

        it('should return false for years divisible by 4 and 100', function() {
            expectFalse('1900-01-01');
        });

        it('should return true for years divisible by 4 and not 100', function() {
            expectTrue('2012-01-01');
            expectTrue('2016-01-01');
            expectTrue('2020-01-01');
        });

        it('should return true for years divisible by 4 and 400', function() {
            expectTrue('2000-01-01');
            expectTrue('2400-01-01');
        });
    });

    describe('lengthOfMonth', function() {
        function expectLength(date, expected) {
            expect(new LocalDate(date).lengthOfMonth()).to.equal(expected);
        }

        it('should return 29 for February in leap years', function() {
            expectLength('2016-02-15', 29);
        });

        it('should return 28 for February in non-leap years', function() {
            expectLength('2017-02-15', 28);
        });

        it('should return 30 for some months', function() {
            expectLength('2017-04-15', 30);
            expectLength('2017-06-15', 30);
            expectLength('2017-09-15', 30);
            expectLength('2017-11-15', 30);
        });

        it('should return 31 for some months', function() {
            expectLength('2017-01-15', 31);
            expectLength('2017-03-15', 31);
            expectLength('2017-05-15', 31);
            expectLength('2017-07-15', 31);
            expectLength('2017-08-15', 31);
            expectLength('2017-10-15', 31);
            expectLength('2017-12-15', 31);
        });
    });

    describe('of()', function() {
        function expectResult(input, expected) {
            const result = LocalDate.of(input);

            expect(result.constructor).to.equal(LocalDate);
            expect(result.toString()).to.equal(expected);
        }

        function expectToThrow(input, expectedError) {
            expect(() => LocalDate.of(input)).to.throw(expectedError);
        }

        it('given an object with the keys "year", "month" and "day" as strings', function() {
            expectResult({year: '2018', month: '5', day: '8'}, '2018-05-08');
            expectResult({year: '2018', month: '12', day: '25'}, '2018-12-25');
        });

        it('given an object with the keys "year", "month" and "day" as numbers', function() {
            expectResult({year: 2018, month: 5, day: 8}, '2018-05-08');
            expectResult({year: 2018, month: 12, day: 25}, '2018-12-25');
        });

        it('given an Date object', function() {
            expectResult(new Date(2018, 4, 23), '2018-05-23');
        });

        it('given an existing LocalDate object should return the same object', function() {
            expectResult(LocalDate.of('2018-05-23'), '2018-05-23');
        });

        it('given a string', function() {
            expectResult('2018-05-23', '2018-05-23');
        });

        it('should throw for invalid values', function() {
            expectToThrow('2018', 'Invalid date given, should be a 10-character string, is: 2018');
            expectToThrow(2018, 'Invalid date given, should be a Date object, is: 2018, type: number, constructor: Number');
            expectToThrow({}, 'Invalid date given, should be a Date object, is: [object Object], type: object, constructor: Object');
            expectToThrow([], 'Invalid date given, should be a Date object, is: , type: object, constructor: Array');
            expectToThrow(null, 'Cannot create a LocalDate from null');
            expectToThrow(undefined, 'Cannot create a LocalDate from undefined');
        });
    });
});
