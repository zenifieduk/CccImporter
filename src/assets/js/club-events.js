document.addEventListener('alpine:init', () => {
  Alpine.data('eventSearch', () => ({
    searchTerm: '',
    category: '',
    location: '',
    events: [],
    filteredEvents: [],
    isLoading: true,
    
    async init() {
      try {
        // Get URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.searchTerm = urlParams.get('search') || '';
        this.category = urlParams.get('category') || '';
        this.location = urlParams.get('location') || '';
        
        // Fetch events
        const response = await fetch('/events.json');
        this.events = await response.json();
        
        // Apply filters
        this.filter();
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing event search:', error);
        this.isLoading = false;
      }
    },
    
    filter() {
      let filtered = [...this.events];
      
      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(event => 
          event.eventTitle.toLowerCase().includes(term) ||
          (event.eventCity && event.eventCity.toLowerCase().includes(term)) ||
          (event.eventState && event.eventState.toLowerCase().includes(term))
        );
      }
      
      // Filter by category
      if (this.category) {
        filtered = filtered.filter(event => {
          if (Array.isArray(event.eventCategory)) {
            return event.eventCategory.some(cat => cat.toLowerCase() === this.category.toLowerCase());
          } else {
            return event.eventCategory && event.eventCategory.toLowerCase() === this.category.toLowerCase();
          }
        });
      }
      
      // Filter by location
      if (this.location) {
        filtered = filtered.filter(event => 
          (event.eventCity && event.eventCity.toLowerCase().includes(this.location.toLowerCase())) ||
          (event.eventState && event.eventState.toLowerCase().includes(this.location.toLowerCase()))
        );
      }
      
      this.filteredEvents = filtered;
    },
    
    search() {
      // Update URL params
      const urlParams = new URLSearchParams();
      if (this.searchTerm) urlParams.set('search', this.searchTerm);
      if (this.category) urlParams.set('category', this.category);
      if (this.location) urlParams.set('location', this.location);
      
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.pushState({}, '', newUrl);
      
      this.filter();
    },
    
    reset() {
      this.searchTerm = '';
      this.category = '';
      this.location = '';
      
      // Update URL
      window.history.pushState({}, '', window.location.pathname);
      
      this.filter();
    },
    
    formatMonth(dateTimeString) {
      if (!dateTimeString) return '';
      
      try {
        const day = dateTimeString.substring(0, 2);
        const month = dateTimeString.substring(2, 4);
        const year = dateTimeString.substring(4, 8);
        
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleString('en-US', { month: 'short' });
      } catch (error) {
        console.error('Error formatting month:', error);
        return '';
      }
    },
    
    formatDay(dateTimeString) {
      if (!dateTimeString) return '';
      
      try {
        const day = dateTimeString.substring(0, 2);
        const month = dateTimeString.substring(2, 4);
        const year = dateTimeString.substring(4, 8);
        
        const date = new Date(`${year}-${month}-${day}`);
        return date.getDate();
      } catch (error) {
        console.error('Error formatting day:', error);
        return '';
      }
    },
    
    formatTime(dateTimeString) {
      if (!dateTimeString) return '';
      
      try {
        const day = dateTimeString.substring(0, 2);
        const month = dateTimeString.substring(2, 4);
        const year = dateTimeString.substring(4, 8);
        const time = dateTimeString.substring(9);
        
        const date = new Date(`${year}-${month}-${day}T${time}`);
        return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      } catch (error) {
        console.error('Error formatting time:', error);
        return '';
      }
    }
  }));
});
