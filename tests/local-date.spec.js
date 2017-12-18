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
});
