const chai = require('chai');
const expect = chai.expect;

const LocalTime = require('../dist/test-bundle.js').LocalTime;

describe('LocalTime', function() {
    describe('toDateObject', function() {
        it('should return a Date object', function() {
            const result = new LocalTime('12:05').toDateObject();

            expect(result.getHours()).to.equal(12);
            expect(result.getMinutes()).to.equal(5);
        });
    });

    describe('of() given a Date object', function() {
        it('should return a LocalTime object', function() {
            const date = new Date(2015, 5, 23, 12, 35, 54);
            const result = LocalTime.of(date);

            expect(result.constructor).to.equal(LocalTime);
            expect(result.toString()).to.equal('12:35');
        });
    });

    describe('of() given a string', function() {
        it('should return a LocalTime object', function() {
            const result = LocalTime.of('12:35');

            expect(result.constructor).to.equal(LocalTime);
            expect(result.toString()).to.equal('12:35');
        });
    });

    describe('of() given an object', function() {
        it('should return a LocalTime object', function() {
            const result = LocalTime.of({hours: 9, minutes: 5});

            expect(result.constructor).to.equal(LocalTime);
            expect(result.toString()).to.equal('09:05');
        });
    });

    describe('getHours and getMinutes', function() {
        it('should return the numeric hours/minutes', function() {
            const time = new LocalTime('23:15');

            expect(time.getHours()).to.equal(23);
            expect(time.getMinutes()).to.equal(15);
        });
    });

    describe('addHours() and minusHours()', function() {
        it('should alter the time', function() {
            expect(new LocalTime('22:30').addHours(1).toString()).to.equal('23:30');
            expect(new LocalTime('00:00').addHours(1).toString()).to.equal('01:00');
            expect(new LocalTime('00:00').addHours(3).toString()).to.equal('03:00');
            expect(new LocalTime('23:45').minusHours(1).toString()).to.equal('22:45');
            expect(new LocalTime('01:00').minusHours(1).toString()).to.equal('00:00');
            expect(new LocalTime('03:10').minusHours(2).toString()).to.equal('01:10');
        });

        it('should throw an error if the time is out of bounds', function() {
            const time = new LocalTime('23:15');

            expect(() => time.addHours(2)).to.throw();
            expect(() => time.minusHours(24)).to.throw();
        });
    });

    describe('addMinutes() and minusMinutes()', function() {
        it('should alter the time', function() {
            const start = new LocalTime('10:00');

            expect(start.addMinutes(1).toString()).to.equal('10:01');
            expect(start.addMinutes(60).toString()).to.equal('11:00');
            expect(start.addMinutes(61).toString()).to.equal('11:01');
            expect(start.minusMinutes(1).toString()).to.equal('09:59');
            expect(start.minusMinutes(60).toString()).to.equal('09:00');
            expect(start.minusMinutes(61).toString()).to.equal('08:59');
        });
    });

    describe('goToStartOfHour() and goToEndOfHour()', function() {
        it('should alter the time', function() {
            expect(new LocalTime('22:00').goToStartOfHour().toString()).to.equal('22:00');
            expect(new LocalTime('22:30').goToStartOfHour().toString()).to.equal('22:00');
            expect(new LocalTime('22:59').goToStartOfHour().toString()).to.equal('22:00');

            expect(new LocalTime('22:00').goToEndOfHour().toString()).to.equal('23:00');
            expect(new LocalTime('22:30').goToEndOfHour().toString()).to.equal('23:00');
            expect(new LocalTime('22:59').goToEndOfHour().toString()).to.equal('23:00');
        });
    });

    describe('isSame()', function() {
        it('should return a boolean', function() {
            const time1 = new LocalTime('10:15');
            const time2 = new LocalTime('10:15');
            const time3 = new LocalTime('11:30');

            expect(time1.isSame(time2)).to.equal(true);
            expect(time1.isSame(time3)).to.equal(false);
        });

        it('should throw if given anything other than a LocalTime', function() {
            const time = new LocalTime('10:15');
            expect(() => time.isSame('asd')).to.throw();
        });
    });

    describe('isSameHour()', function() {
        it('should return a boolean', function() {
            const time1 = new LocalTime('11:00');
            const time2 = new LocalTime('11:30');
            const time3 = new LocalTime('12:00');

            expect(time1.isSameHour(time2)).to.equal(true);
            expect(time1.isSameHour(time3)).to.equal(false);
        });
    });

    describe('isAfter()', function() {
        it('should return a boolean', function() {
            const time1 = new LocalTime('10:15');
            const time2 = new LocalTime('10:15');
            const time3 = new LocalTime('11:30');

            expect(time1.isAfter(time2)).to.equal(false);
            expect(time1.isAfter(time3)).to.equal(false);
            expect(time3.isAfter(time2)).to.equal(true);
        });

        it('should throw if given anything other than a LocalTime', function() {
            const time = new LocalTime('10:15');
            expect(() => time.isAfter('asd')).to.throw();
            expect(() => time.isAfter(1)).to.throw();
            expect(() => time.isAfter()).to.throw();
            expect(() => time.isAfter(null)).to.throw();
        });
    });

    describe('isBefore()', function() {
        it('should return a boolean', function() {
            const time1 = new LocalTime('11:00');
            const time2 = new LocalTime('11:30');
            const time3 = new LocalTime('12:00');

            expect(time1.isBefore(time2)).to.equal(true);
            expect(time2.isBefore(time3)).to.equal(true);
            expect(time2.isBefore(time3)).to.equal(true);

            expect(time2.isBefore(time1)).to.equal(false);
            expect(time3.isBefore(time1)).to.equal(false);
            expect(time3.isBefore(time2)).to.equal(false);

            expect(time2.isBefore(time2)).to.equal(false);
        });

        it('should throw if given anything other than a LocalTime', function() {
            const time = new LocalTime('10:15');
            expect(() => time.isBefore('asd')).to.throw();
            expect(() => time.isBefore(1)).to.throw();
            expect(() => time.isBefore()).to.throw();
            expect(() => time.isBefore(null)).to.throw();
        });
    });

    describe('toNumber()', function() {
        it('should return a number', function() {
            expect(new LocalTime('09:45').toNumber()).to.equal(945);
            expect(new LocalTime('11:00').toNumber()).to.equal(1100);
        });
    });

    describe('isFullOrHalfHour()', function() {
        function test(input, expectation) {
            expect(new LocalTime(input).isFullOrHalfHour()).to.equal(expectation);
        }

        it('should return true on the hour or half hour', function() {
            test('00:00', true);
            test('09:00', true);
            test('09:30', true);
            test('12:00', true);
            test('12:30', true);
        });

        it('should return false otherwise', function() {
            test('08:05', false);
            test('08:59', false);
            test('09:45', false);
            test('09:49', false);
            test('09:03', false);
        });
    });
});
