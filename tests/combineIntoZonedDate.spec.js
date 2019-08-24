const chai = require('chai');
const expect = chai.expect;
const timezoneMock = require('timezone-mock');
const LocalDate = require('../dist/test-bundle.js').LocalDate;
const LocalTime = require('../dist/test-bundle.js').LocalTime;
const combineIntoZonedDate = require('../dist/test-bundle.js').combineIntoZonedDate;

describe('combineIntoZonedDate()', function() {
    afterEach(function() {
        timezoneMock.unregister();
    });

    const may23 = new LocalDate('2019-05-23');
    const oneOClock = new LocalTime('13:00');

    it('should return a Date object', function() {
        expect(combineIntoZonedDate(may23, oneOClock).constructor).to.equal(Date);
    });

    function getZonedISOString() {
        return combineIntoZonedDate(may23, oneOClock).toISOString();
    }

    it('should return the correct zoned date using the system\'s timezone', function() {
        timezoneMock.register('UTC');
        expect(getZonedISOString()).to.equal('2019-05-23T13:00:00.000Z');

        timezoneMock.register('US/Eastern');
        expect(getZonedISOString()).to.equal('2019-05-23T17:00:00.000Z');

        timezoneMock.register('Brazil/East');
        expect(getZonedISOString()).to.equal('2019-05-23T16:00:00.000Z');
    });
});
