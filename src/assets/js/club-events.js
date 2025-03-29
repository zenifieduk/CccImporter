document.addEventListener('alpine:init', () => {
  Alpine.data('eventSearch', () => ({
    searchTerm: '',
    category: '',
    location: '',
    events: [],
    filteredEvents: [],
    categories: [],
    locations: [],
    availableCategories: [],
    availableLocations: [],
    isLoading: true,
    
    initSearch() {
      // Add a popstate event listener to handle browser back/forward buttons
      window.addEventListener('popstate', () => {
        // Get URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.searchTerm = urlParams.get('search') || '';
        this.category = urlParams.get('category') || '';
        this.location = urlParams.get('location') || '';
        
        // Apply the filters immediately
        this.filter();
      });
      
      // Get URL params again to ensure we have the latest
      const urlParams = new URLSearchParams(window.location.search);
      this.searchTerm = urlParams.get('search') || '';
      this.category = urlParams.get('category') || '';
      this.location = urlParams.get('location') || '';
      
      // Apply search if there are parameters
      if (this.searchTerm || this.category || this.location) {
        this.filter();
      }
    },
    
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
      this.updateAvailableOptions(filtered);
    },
    
    updateAvailableOptions(filtered) {
      // Update available categories
      if (this.events.length > 0) {
        const categorySet = new Set();
        filtered.forEach(event => {
          if (Array.isArray(event.eventCategory)) {
            event.eventCategory.forEach(cat => categorySet.add(cat));
          } else if (event.eventCategory) {
            categorySet.add(event.eventCategory);
          }
        });
        this.availableCategories = [...categorySet].sort();
        
        // Update available locations
        const locationSet = new Set();
        filtered.forEach(event => {
          if (event.eventCity) locationSet.add(event.eventCity);
          if (event.eventState) locationSet.add(event.eventState);
        });
        this.availableLocations = [...locationSet].sort();
      }
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
    
    resetFilters() {
      // Alias for reset() for compatibility
      this.reset();
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
        console.error('Error formatting month:', error, dateTimeString);
        return '';
      }
    },
    
    formatDay(dateTimeString) {
      if (!dateTimeString) return '';
      
      try {
        const day = dateTimeString.substring(0, 2);
        return parseInt(day);
      } catch (error) {
        console.error('Error formatting day:', error, dateTimeString);
        return '';
      }
    },
    
    formatTime(dateTimeString) {
      if (!dateTimeString) return '';
      
      try {
        const time = dateTimeString.split(':');
        if (time.length >= 3) {
          const hours = parseInt(time[1]);
          const minutes = time[2];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const hour12 = hours % 12 || 12;
          return `${hour12}:${minutes} ${ampm}`;
        }
        return dateTimeString;
      } catch (error) {
        console.error('Error formatting time:', error, dateTimeString);
        return '';
      }
    }
  }));
});
