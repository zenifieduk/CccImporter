
module.exports = {
  currentYear() {
    return new Date().getFullYear();
  },
  
  // Parse date string in format DDMMYYYY:HH:MM:SS to Date object
  parseEventDate(dateStr) {
    if (!dateStr) return null;
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    const time = dateStr.substring(9);
    return new Date(`${year}-${month}-${day}T${time}`);
  },
  
  // Check if an event is in the future
  isUpcomingEvent(event) {
    if (!event.eventStartDateTime) return false;
    const eventDate = this.parseEventDate(event.eventStartDateTime);
    const now = new Date();
    return eventDate > now;
  },
  
  // Filter array of events to only show upcoming ones
  getUpcomingEvents(events) {
    return events.filter(event => this.isUpcomingEvent(event));
  }
};
