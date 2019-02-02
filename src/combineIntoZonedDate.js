import LocalTime from './local-time';
import LocalDate from './local-date';

function combineIntoZonedDate(localDate, localTime) {
    if (!localDate) {
        throw new Error('Argument localDate must be given, but is: ' + localDate);
    }
    if (!localTime) {
        throw new Error('Argument localTime must be given, but is: ' + localTime);
    }

    const timezone = new Date().toString().match(/([-+][0-9]+)\s/)[1];
    const timezoneWithColon = timezone.substring(0, 3) + ':' + timezone.substring(3);
    const toParse = localDate.toString() + 'T' + localTime.toString() + ':00' + timezoneWithColon;
    return new Date(toParse);
}

export default combineIntoZonedDate;
