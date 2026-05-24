// Global function to parse auction dates in "DDMMYYYY:HH:MM:SS" format
function parseAuctionDate(dateStr) {
  if (!dateStr) return new Date();
  
  try {
    // Extract day, month, year, and time parts
    var day = dateStr.substring(0, 2);
    var month = dateStr.substring(2, 4);
    var year = dateStr.substring(4, 8);
    var time = dateStr.substring(9); // time starts after the colon at index 8
    return new Date(year + '-' + month + '-' + day + 'T' + time);
  } catch (e) {
    console.error('Error parsing auction date:', e, dateStr);
    return new Date();
  }
}

// Define Alpine.js component for auction date formatting
document.addEventListener('alpine:init', () => {
  Alpine.data('auctionDisplay', () => ({
    formatMonth(dateStr) {
      const date = parseAuctionDate(dateStr);
      return date.toLocaleString('default', { month: 'short' });
    },
    formatDay(dateStr) {
      const date = parseAuctionDate(dateStr);
      return date.getDate();
    },
    formatTime(dateStr) {
      const date = parseAuctionDate(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }));
});