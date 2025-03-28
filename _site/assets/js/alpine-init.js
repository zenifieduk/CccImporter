document.addEventListener('alpine:init', () => {
  Alpine.data('mobileMenu', () => ({
    isOpen: false,
    
    toggle() {
      this.isOpen = !this.isOpen;
      
      // Prevent scrolling when menu is open
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    
    close() {
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }));
  
  Alpine.data('clubSearch', () => ({
    searchTerm: '',
    category: '',
    location: '',
    letter: '',
    clubs: [],
    filteredClubs: [],
    categories: [],
    locations: [],
    availableCategories: [], // Categories available after filtering
    availableLocations: [], // Locations available after filtering
    isLoading: true,
    
    async init() {
      try {
        // Get URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.searchTerm = urlParams.get('search') || '';
        this.category = urlParams.get('category') || '';
        this.location = urlParams.get('location') || '';
        this.letter = urlParams.get('letter') || '';
        
        // Fetch clubs
        const response = await fetch('/clubs.json');
        this.clubs = await response.json();

        // For debugging
        console.log('Loaded clubs:', this.clubs.length);
        console.log('Search term:', this.searchTerm);
        
        // Extract unique categories and locations for dropdown options (all available)
        const categorySet = new Set();
        const locationSet = new Set();
        
        this.clubs.forEach(club => {
          if (club.category) categorySet.add(club.category);
          if (club.city) locationSet.add(club.city);
        });
        
        this.categories = [...categorySet].sort();
        this.locations = [...locationSet].sort();
        
        console.log('All categories loaded:', this.categories.length);
        console.log('All locations loaded:', this.locations.length);
        
        // Apply filters
        this.filter();
        
        // Update available options based on filtered results
        this.updateAvailableOptions();

        // For debugging
        console.log('Filtered clubs:', this.filteredClubs.length);
        console.log('Available categories after filtering:', this.availableCategories.length);
        console.log('Available locations after filtering:', this.availableLocations.length);
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing search:', error);
        this.isLoading = false;
      }
    },
    
    // Method to update available options based on current filters
    updateAvailableOptions() {
      // Determine which filters are active
      const hasSearchTerm = this.searchTerm && this.searchTerm.trim() !== '';
      const hasCategory = this.category && this.category !== '';
      const hasLocation = this.location && this.location !== '';
      const hasLetter = this.letter && this.letter !== '';
      
      // If no filters are active, all options are available
      if (!hasSearchTerm && !hasCategory && !hasLocation && !hasLetter) {
        this.availableCategories = this.categories;
        this.availableLocations = this.locations;
        return;
      }
      
      // Create a temporary filter function that excludes the category or location filter
      // This will be used to determine available options for each dropdown
      
      // For category dropdown (exclude category filter)
      const forCategoryOptions = [...this.clubs].filter(club => {
        // Apply all filters except category
        let include = true;
        
        if (hasSearchTerm) {
          const term = this.searchTerm.toLowerCase().trim();
          const titleMatch = club.title && club.title.toLowerCase().includes(term);
          const cityMatch = club.city && club.city.toLowerCase().includes(term);
          const stateMatch = club.state && club.state.toLowerCase().includes(term);
          const marqueMatch = club.marque && club.marque.toLowerCase().includes(term);
          
          include = include && (titleMatch || cityMatch || stateMatch || marqueMatch);
        }
        
        if (hasLocation) {
          include = include && (club.city && club.city === this.location);
        }
        
        if (hasLetter) {
          include = include && (club.title && club.title.toLowerCase().startsWith(this.letter.toLowerCase()));
        }
        
        return include;
      });
      
      // For location dropdown (exclude location filter)
      const forLocationOptions = [...this.clubs].filter(club => {
        // Apply all filters except location
        let include = true;
        
        if (hasSearchTerm) {
          const term = this.searchTerm.toLowerCase().trim();
          const titleMatch = club.title && club.title.toLowerCase().includes(term);
          const cityMatch = club.city && club.city.toLowerCase().includes(term);
          const stateMatch = club.state && club.state.toLowerCase().includes(term);
          const marqueMatch = club.marque && club.marque.toLowerCase().includes(term);
          
          include = include && (titleMatch || cityMatch || stateMatch || marqueMatch);
        }
        
        if (hasCategory) {
          include = include && (club.category && club.category.toLowerCase() === this.category.toLowerCase());
        }
        
        if (hasLetter) {
          include = include && (club.title && club.title.toLowerCase().startsWith(this.letter.toLowerCase()));
        }
        
        return include;
      });
      
      // Extract available categories and locations from filtered results
      const availableCategorySet = new Set();
      forCategoryOptions.forEach(club => {
        if (club.category) availableCategorySet.add(club.category);
      });
      
      const availableLocationSet = new Set();
      forLocationOptions.forEach(club => {
        if (club.city) availableLocationSet.add(club.city);
      });
      
      // Update available options
      this.availableCategories = [...availableCategorySet].sort();
      this.availableLocations = [...availableLocationSet].sort();
    },
    
    filter() {
      // Start with a copy of all clubs
      let filtered = [...this.clubs];
      
      // Filter by search term (case insensitive)
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase().trim();
        console.log('Filtering by term:', term);
        
        filtered = filtered.filter(club => {
          // Check various fields for the search term
          const titleMatch = club.title && club.title.toLowerCase().includes(term);
          const cityMatch = club.city && club.city.toLowerCase().includes(term);
          const stateMatch = club.state && club.state.toLowerCase().includes(term);
          const marqueMatch = club.marque && club.marque.toLowerCase().includes(term);
          
          return titleMatch || cityMatch || stateMatch || marqueMatch;
        });
        
        console.log('After term filtering:', filtered.length);
      }
      
      // Filter by category (exact match, case insensitive)
      if (this.category && this.category !== '') {
        console.log('Filtering by category:', this.category);
        
        filtered = filtered.filter(club => 
          club.category && club.category.toLowerCase() === this.category.toLowerCase()
        );
        
        console.log('After category filtering:', filtered.length);
      }
      
      // Filter by location (exact match)
      if (this.location && this.location !== '') {
        console.log('Filtering by location:', this.location);
        
        filtered = filtered.filter(club => 
          club.city && club.city === this.location
        );
        
        console.log('After location filtering:', filtered.length);
      }
      
      // Filter by letter (starts with)
      if (this.letter && this.letter !== '') {
        console.log('Filtering by letter:', this.letter);
        
        filtered = filtered.filter(club => 
          club.title && club.title.toLowerCase().startsWith(this.letter.toLowerCase())
        );
        
        console.log('After letter filtering:', filtered.length);
      }
      
      this.filteredClubs = filtered;
      
      // Update the available filter options based on the filtered results
      this.updateAvailableOptions();
    },
    
    search() {
      // Update URL params
      const urlParams = new URLSearchParams();
      if (this.searchTerm) urlParams.set('search', this.searchTerm);
      if (this.category) urlParams.set('category', this.category);
      if (this.location) urlParams.set('location', this.location);
      if (this.letter) urlParams.set('letter', this.letter);
      
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.pushState({}, '', newUrl);
      
      this.filter();
      // Available options are already updated in the filter method
    },
    
    reset() {
      this.searchTerm = '';
      this.category = '';
      this.location = '';
      this.letter = '';
      
      // Update URL
      window.history.pushState({}, '', window.location.pathname);
      
      this.filter();
      // Reset available options to all options
      this.availableCategories = this.categories;
      this.availableLocations = this.locations;
    },
    
    resetFilters() {
      this.searchTerm = '';
      this.category = '';
      this.location = '';
      this.letter = '';
      
      // Update URL
      window.history.pushState({}, '', window.location.pathname);
      
      this.filter();
      // Reset available options to all options
      this.availableCategories = this.categories;
      this.availableLocations = this.locations;
    },
    
    setLetter(letter) {
      this.letter = this.letter === letter ? '' : letter;
      this.search();
    }
  }));
  
  Alpine.data('eventSearch', () => ({
    searchTerm: '',
    category: '',
    location: '',
    events: [],
    filteredEvents: [],
    categories: [],
    locations: [],
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
        
        // For debugging
        console.log('Loaded events:', this.events.length);
        console.log('Search term:', this.searchTerm);
        
        // Extract unique categories and locations for dropdown options
        const categorySet = new Set();
        const locationSet = new Set();
        
        this.events.forEach(event => {
          // Handle both array and string categories
          if (Array.isArray(event.eventCategory)) {
            event.eventCategory.forEach(cat => {
              if (cat) categorySet.add(cat);
            });
          } else if (event.eventCategory) {
            categorySet.add(event.eventCategory);
          }
          
          if (event.eventCity) locationSet.add(event.eventCity);
        });
        
        this.categories = [...categorySet].sort();
        this.locations = [...locationSet].sort();
        
        console.log('Event categories loaded:', this.categories.length);
        console.log('Event locations loaded:', this.locations.length);
        
        // Apply filters
        this.filter();
        
        // For debugging
        console.log('Filtered events:', this.filteredEvents.length);
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing search:', error);
        this.isLoading = false;
      }
    },
    
    // Helper method to format event dates for display
    formatMonth(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleString('default', { month: 'short' });
      } catch (e) {
        console.error('Error formatting month:', e);
        return '';
      }
    },
    
    // Helper method to format event days for display
    formatDay(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.getDate();
      } catch (e) {
        console.error('Error formatting day:', e);
        return '';
      }
    },
    
    // Helper method to format event time for display
    formatTime(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        console.error('Error formatting time:', e);
        return '';
      }
    },
    
    filter() {
      // Start with a copy of all events
      let filtered = [...this.events];
      
      // Filter by search term (case insensitive)
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase().trim();
        console.log('Filtering events by term:', term);
        
        filtered = filtered.filter(event => {
          // Check various fields for the search term
          const titleMatch = event.eventTitle && event.eventTitle.toLowerCase().includes(term);
          const descMatch = event.eventDescription && event.eventDescription.toLowerCase().includes(term);
          const cityMatch = event.eventCity && event.eventCity.toLowerCase().includes(term);
          const stateMatch = event.eventState && event.eventState.toLowerCase().includes(term);
          const venueMatch = event.eventVenue && event.eventVenue.toLowerCase().includes(term);
          
          return titleMatch || descMatch || cityMatch || stateMatch || venueMatch;
        });
        
        console.log('After term filtering events:', filtered.length);
      }
      
      // Filter by category
      if (this.category && this.category !== '') {
        console.log('Filtering events by category:', this.category);
        
        filtered = filtered.filter(event => {
          if (Array.isArray(event.eventCategory)) {
            return event.eventCategory.some(cat => cat.toLowerCase() === this.category.toLowerCase());
          } else {
            return event.eventCategory && event.eventCategory.toLowerCase() === this.category.toLowerCase();
          }
        });
        
        console.log('After category filtering events:', filtered.length);
      }
      
      // Filter by location
      if (this.location && this.location !== '') {
        console.log('Filtering events by location:', this.location);
        
        filtered = filtered.filter(event => 
          event.eventCity && event.eventCity === this.location
        );
        
        console.log('After location filtering events:', filtered.length);
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
    }
  }));
  
  Alpine.data('pagination', () => ({
    currentPage: 1,
    itemsPerPage: 40,
    totalItems: 0,
    totalPages: 0,
    items: [],
    paginatedItems: [],
    
    init() {
      // Get URL params
      const urlParams = new URLSearchParams(window.location.search);
      this.currentPage = parseInt(urlParams.get('page') || '1');
      
      this.$watch('items', (items) => {
        this.totalItems = items.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.paginate();
      });
    },
    
    paginate() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedItems = this.items.slice(startIndex, endIndex);
    },
    
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      
      this.currentPage = page;
      this.paginate();
      
      // Update URL
      const urlParams = new URLSearchParams(window.location.search);
      if (page > 1) {
        urlParams.set('page', page);
      } else {
        urlParams.delete('page');
      }
      
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.pushState({}, '', newUrl);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    get pageNumbers() {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (this.totalPages <= maxVisiblePages) {
        // Show all pages
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show a range of pages
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;
        
        // Adjust if at the end
        if (endPage > this.totalPages) {
          endPage = this.totalPages;
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
          pages.push(1);
          if (startPage > 2) pages.push('...');
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        // Add last page and ellipsis if needed
        if (endPage < this.totalPages) {
          if (endPage < this.totalPages - 1) pages.push('...');
          pages.push(this.totalPages);
        }
      }
      
      return pages;
    },
    
    get startIndex() {
      return Math.min(this.totalItems, (this.currentPage - 1) * this.itemsPerPage + 1);
    },
    
    get endIndex() {
      return Math.min(this.totalItems, this.currentPage * this.itemsPerPage);
    }
  }));
});
