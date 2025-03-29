document.addEventListener('alpine:init', () => {
  // Event display component for date/time formatting
  Alpine.data('eventDisplay', () => ({
    formatMonth(dateStr) {
      if (!dateStr) return '';
      try {
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 8);
        
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
        const day = dateStr.substring(0, 2);
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

  // Search functionality
  Alpine.data('search', () => ({
    searchTerm: '',
    category: '',
    location: '',
    letter: '',
    clubs: [],
    filteredClubs: [],
    categories: [],
    locations: [],
    availableCategories: [],
    availableLocations: [],

    init() {
      this.clubs = window.clubs || [];
      this.filteredClubs = [...this.clubs];

      // Get unique categories and locations
      this.categories = [...new Set(this.clubs.flatMap(club => club.clubCategory || []))].sort();
      this.locations = [...new Set(this.clubs.map(club => club.clubCity).filter(Boolean))].sort();

      // Initialize available options
      this.availableCategories = [...this.categories];
      this.availableLocations = [...this.locations];

      // Get URL params
      const urlParams = new URLSearchParams(window.location.search);
      this.searchTerm = urlParams.get('search') || '';
      this.category = urlParams.get('category') || '';
      this.location = urlParams.get('location') || '';
      this.letter = urlParams.get('letter') || '';

      if (this.searchTerm || this.category || this.location || this.letter) {
        this.filter();
      }
    },

    filter() {
      let filtered = [...this.clubs];

      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(club => 
          club.clubName.toLowerCase().includes(term) ||
          (club.clubCity && club.clubCity.toLowerCase().includes(term))
        );
      }

      // Filter by category
      if (this.category) {
        filtered = filtered.filter(club => 
          club.clubCategory && club.clubCategory.includes(this.category)
        );
      }

      // Filter by location
      if (this.location) {
        filtered = filtered.filter(club => 
          club.clubCity && club.clubCity === this.location
        );
      }

      // Filter by letter
      if (this.letter) {
        filtered = filtered.filter(club => 
          club.clubName.charAt(0).toUpperCase() === this.letter
        );
      }

      this.filteredClubs = filtered;

      // Update available filter options based on current filtered results
      this.updateAvailableOptions(filtered);
    },

    updateAvailableOptions(filtered) {
      // Update available categories
      this.availableCategories = [...new Set(filtered.flatMap(club => club.clubCategory || []))].sort();

      // Update available locations
      this.availableLocations = [...new Set(filtered.map(club => club.clubCity).filter(Boolean))].sort();
    },

    search() {
      // Update URL
      const urlParams = new URLSearchParams(window.location.search);
      if (this.searchTerm) urlParams.set('search', this.searchTerm);
      else urlParams.delete('search');
      if (this.category) urlParams.set('category', this.category);
      else urlParams.delete('category');
      if (this.location) urlParams.set('location', this.location);
      else urlParams.delete('location');
      if (this.letter) urlParams.set('letter', this.letter);
      else urlParams.delete('letter');

      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.pushState({}, '', newUrl);

      this.filter();
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

    setLetter(letter) {
      this.letter = this.letter === letter ? '' : letter;
      this.search();
    }
  }));

  // Event search functionality  
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

    async init() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        this.searchTerm = urlParams.get('search') || '';
        this.category = urlParams.get('category') || '';
        this.location = urlParams.get('location') || '';

        const response = await fetch('/events.json');
        this.events = await response.json();
        this.filter();

        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing event search:', error);
        this.isLoading = false;
      }
    },

    filter() {
      let filtered = [...this.events];

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(event => 
          event.eventTitle.toLowerCase().includes(term) ||
          (event.eventCity && event.eventCity.toLowerCase().includes(term)) ||
          (event.eventState && event.eventState.toLowerCase().includes(term))
        );
      }

      if (this.category) {
        filtered = filtered.filter(event => 
          event.eventCategory && event.eventCategory.includes(this.category)
        );
      }

      if (this.location) {
        filtered = filtered.filter(event => 
          (event.eventCity && event.eventCity === this.location) ||
          (event.eventState && event.eventState === this.location)
        );
      }

      this.filteredEvents = filtered;
      this.updateAvailableOptions(filtered);
    },

    updateAvailableOptions(filtered) {
      this.availableCategories = [...new Set(filtered.flatMap(event => event.eventCategory || []))].sort();
      this.availableLocations = [...new Set([
        ...filtered.map(event => event.eventCity),
        ...filtered.map(event => event.eventState)
      ].filter(Boolean))].sort();
    },

    search() {
      const urlParams = new URLSearchParams(window.location.search);
      if (this.searchTerm) urlParams.set('search', this.searchTerm);
      else urlParams.delete('search');
      if (this.category) urlParams.set('category', this.category);
      else urlParams.delete('category');
      if (this.location) urlParams.set('location', this.location);
      else urlParams.delete('location');

      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.pushState({}, '', newUrl);

      this.filter();
    },

    reset() {
      this.searchTerm = '';
      this.category = '';
      this.location = '';

      window.history.pushState({}, '', window.location.pathname);
      this.filter();
    }
  }));

  Alpine.data('mobileMenu', () => ({
    isOpen: false,
    toggle() {
      this.isOpen = !this.isOpen;
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

        // Set available options initially to all options
        this.availableCategories = this.categories;
        this.availableLocations = this.locations;

        // Apply filters only if there are any parameters
        if (this.searchTerm || this.category || this.location || this.letter) {
          this.filter();
          this.updateAvailableOptions();
        } else {
          // Initialize filteredClubs with all clubs if no filters are active
          this.filteredClubs = [...this.clubs];
        }

        // For debugging
        console.log('Filtered clubs:', this.filteredClubs.length);
        console.log('Available categories after filtering:', this.availableCategories.length);
        console.log('Available locations after filtering:', this.availableLocations.length);

        this.isLoading = false;

        // Add watchers for real-time filter updates
        this.$watch('category', value => {
          if (this.category !== undefined) {
            // Update the available options for other dropdowns when category changes
            this.updateAvailableOptions();
          }
        });

        this.$watch('location', value => {
          if (this.location !== undefined) {
            // Update the available options for other dropdowns when location changes
            this.updateAvailableOptions();
          }
        });

        this.$watch('letter', value => {
          if (this.letter !== undefined) {
            // Update the available options for other dropdowns when letter changes
            this.updateAvailableOptions();
          }
        });
      } catch (error) {
        console.error('Error initializing search:', error);
        this.isLoading = false;
      }
    },

    // Method to manually initialize search - can be called from the template
    initSearch() {
      // This method can be called from the x-init directive in the template
      // It ensures that if we come directly to the page with URL parameters,
      // the search is properly applied

      // Add a popstate event listener to handle browser back/forward buttons
      window.addEventListener('popstate', () => {
        // Get URL params
        const urlParams = new URLSearchParams(window.location.search);
        this.searchTerm = urlParams.get('search') || '';
        this.category = urlParams.get('category') || '';
        this.location = urlParams.get('location') || '';
        this.letter = urlParams.get('letter') || '';

        // Apply the filters immediately
        this.filter();
      });

      // Get URL params again to ensure we have the latest
      const urlParams = new URLSearchParams(window.location.search);
      const searchTerm = urlParams.get('search') || '';
      const category = urlParams.get('category') || '';
      const location = urlParams.get('location') || '';
      const letter = urlParams.get('letter') || '';

      // Update the model
      this.searchTerm = searchTerm;
      this.category = category;
      this.location = location;
      this.letter = letter;

      // Apply search if there are parameters
      if (searchTerm || category || location || letter) {
        // Apply the search immediately - no delay needed as we're inside an init function
        // which will be called after data is available
        this.filter();
        this.updateAvailableOptions();
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
    availableCategories: [],
    availableLocations: [],
    isLoading: true,

    async init() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        this.searchTerm = urlParams.get('search') || '';
        this.category = urlParams.get('category') || '';
        this.location = urlParams.get('location') || '';

        const response = await fetch('/events.json');
        this.events = await response.json();
        this.filter();

        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing event search:', error);
        this.isLoading = false;
      }
    },

    filter() {
      let filtered = [...this.events];

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(event =>
          event.eventTitle.toLowerCase().includes(term) ||
          (event.eventCity && event.eventCity.toLowerCase().includes(term)) ||
          (event.eventState && event.eventState.toLowerCase().includes(term))
        );
      }

      if (this.category) {
        filtered = filtered.filter(event =>
          event.eventCategory && event.eventCategory.includes(this.category)
        );
      }

      if (this.location) {
        filtered = filtered.filter(event =>
          (event.eventCity && event.eventCity === this.location) ||
          (event.eventState && event.eventState === this.location)
        );
      }

      this.filteredEvents = filtered;
      this.updateAvailableOptions(filtered);
    },

    updateAvailableOptions(filtered) {
      this.availableCategories = [...new Set(filtered.flatMap(event => event.eventCategory || []))].sort();
      this.availableLocations = [...new Set([
        ...filtered.map(event => event.eventCity),
        ...filtered.map(event => event.eventState)
      ].filter(Boolean))].sort();
    },

    search() {
      const urlParams = new URLSearchParams(window.location.search);
      if (this.searchTerm) urlParams.set('search', this.searchTerm);
      else urlParams.delete('search');
      if (this.category) urlParams.set('category', this.category);
      else urlParams.delete('category');
      if (this.location) urlParams.set('location', this.location);
      else urlParams.delete('location');

      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.pushState({}, '', newUrl);

      this.filter();
    },

    reset() {
      this.searchTerm = '';
      this.category = '';
      this.location = '';

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

      // For fewer pages, just show all numbers
      if (this.totalPages <= 7) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
        return pages;
      }

      // Always show first page
      pages.push(1);

      // Show first few pages based on current location
      if (this.currentPage <= 4) {
        // When near the beginning, show first 5 pages
        for (let i = 2; i <= 5; i++) {
          if (i <= this.totalPages) pages.push(i);
        }
        // Add ellipsis if there are more pages
        if (this.totalPages > 6) pages.push('...');
        // Add the last page if not already included
        if (this.totalPages > 5) pages.push(this.totalPages);
      } else if (this.currentPage > this.totalPages - 4) {
        // When near the end
        pages.push('...');
        // Show last 5 pages
        for (let i = Math.max(2, this.totalPages - 4); i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // When in the middle
        pages.push('...');
        // Show current page and some neighbors
        for (let i = this.currentPage - 1; i <= Math.min(this.currentPage + 1, this.totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
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