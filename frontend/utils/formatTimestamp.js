import moment from 'moment';

const  formatTimestampMessage = (createdAt) => {
    const now = moment();
    const createdMoment = moment(createdAt);
    const diffInSeconds = now.diff(createdMoment, 'seconds');
    const diffInMinutes = now.diff(createdMoment, 'minutes');
    const diffInHours = now.diff(createdMoment, 'hours');
    const diffInDays = now.diff(createdMoment, 'days');

    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
        return createdMoment.format('ddd h:mm A'); // "Sun 5:05 PM"
    } else if (now.year() === createdMoment.year()) {
        return createdMoment.format('MMM D, h:mm A'); // "May 31, 5:05 PM"
    } else {
        return createdMoment.format('MMM D, YYYY, h:mm A'); // "May 31, 2024, 5:05 PM"
    }
}
export default formatTimestampMessage;