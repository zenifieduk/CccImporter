document.addEventListener('alpine:init', () => {
  // Auction display component for date/time formatting
  Alpine.data('auctionDisplay', () => ({
    formatMonth(dateStr) {
      if (!dateStr) return '';
      try {
        // Extract just the date part (before the colon)
        const datePart = dateStr.split(':')[0];
        const day = datePart.substring(0, 2);
        const month = datePart.substring(2, 4);
        const year = datePart.substring(4, 8);
        
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleString('default', { month: 'short' });
      } catch (e) {
        console.error('Error formatting month:', e, dateStr);
        return 'Invalid';
      }
    },

    formatDay(dateStr) {
      if (!dateStr) return '';
      try {
        // Extract just the date part (before the colon)
        const datePart = dateStr.split(':')[0];
        const day = datePart.substring(0, 2);
        return parseInt(day);
      } catch (e) {
        console.error('Error formatting day:', e, dateStr);
        return '';
      }
    },

    formatTime(dateStr) {
      if (!dateStr) return '';
      try {
        const time = dateStr.split(':');
        if (time.length >= 3) {
          const hours = parseInt(time[1]);
          const minutes = time[2];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const hour12 = hours % 12 || 12;
          return `${hour12}:${minutes} ${ampm}`;
        }
        return dateStr; // Return original if format is unexpected
      } catch (e) {
        console.error('Error formatting time:', e, dateStr);
        return '';
      }
    }
  }));
});