// Mobile menu component
document.addEventListener('alpine:init', () => {
  Alpine.data('mobileMenu', () => ({
    open: false,
    
    toggle() {
      this.open = !this.open;
    },
    
    close() {
      this.open = false;
    }
  }));
  
  // Club Directory component
  Alpine.data('clubDirectory', () => ({
    clubs: [],
    filteredClubs: [],
    searchQuery: '',
    activeLetter: '',
    filters: {
      category: '',
      founded: ''
    },
    availableFilters: {
      categories: [],
      decades: []
    },
    currentPage: 1,
    itemsPerPage: 12,
    
    async init() {
      try {
        // Fetch clubs data
        const response = await fetch('/clubs.json');
        this.clubs = await response.json();
        
        // Set initial filtered clubs
        this.filteredClubs = this.clubs;
        
        // Extract unique categories and decades
        const allCategories = this.clubs.flatMap(club => club.categories || []);
        this.availableFilters.categories = [...new Set(allCategories)].sort();
        
        const allYears = this.clubs.map(club => club.founded).filter(Boolean);
        const decades = allYears.map(year => Math.floor(year / 10) * 10);
        this.availableFilters.decades = [...new Set(decades)].sort();
      } catch (error) {
        console.error('Error fetching clubs data:', error);
      }
    },
    
    filter() {
      let result = this.clubs;
      
      // Filter by letter
      if (this.activeLetter) {
        result = result.filter(club => 
          club.name.charAt(0).toUpperCase() === this.activeLetter
        );
      }
      
      // Filter by category
      if (this.filters.category) {
        result = result.filter(club => 
          club.categories && club.categories.includes(this.filters.category)
        );
      }
      
      // Filter by founded decade
      if (this.filters.founded) {
        const decadeStart = parseInt(this.filters.founded);
        const decadeEnd = decadeStart + 9;
        result = result.filter(club => 
          club.founded >= decadeStart && club.founded <= decadeEnd
        );
      }
      
      // Apply search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(club => 
          club.name.toLowerCase().includes(query) || 
          (club.description && club.description.toLowerCase().includes(query))
        );
      }
      
      this.filteredClubs = result;
      this.currentPage = 1;
      
      // Update available filter options based on current filtered results
      this.updateAvailableOptions(result);
    },
    
    updateAvailableOptions(filtered) {
      // This could be implemented to dynamically update filter options
      // based on the current filtered results, but for simplicity we'll keep static options
    },
    
    search() {
      this.filter();
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.activeLetter = '';
      this.filters.category = '';
      this.filters.founded = '';
      this.filteredClubs = this.clubs;
      this.currentPage = 1;
    },
    
    setLetter(letter) {
      this.activeLetter = letter;
      this.filter();
    },
    
    paginate() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredClubs.slice(startIndex, endIndex);
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.pageCount) {
        this.currentPage = page;
      }
    },
    
    get pageCount() {
      return Math.ceil(this.filteredClubs.length / this.itemsPerPage);
    },
    
    get pageNumbers() {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (this.pageCount <= maxVisiblePages) {
        // Show all pages if there are few
        for (let i = 1; i <= this.pageCount; i++) {
          pages.push(i);
        }
      } else {
        // Show a subset of pages with current page in the middle if possible
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.pageCount, startPage + maxVisiblePages - 1);
        
        // Adjust if we're near the end
        if (endPage === this.pageCount) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    },
    
    get paginatedClubs() {
      return this.paginate();
    },
    
    get startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    
    get endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredClubs.length);
    },
    
    get isFiltered() {
      return this.searchQuery || this.activeLetter || this.filters.category || this.filters.founded;
    }
  }));
  
  // Events Directory component
  Alpine.data('eventsDirectory', () => ({
    events: [],
    filteredEvents: [],
    searchQuery: '',
    filters: {
      category: '',
      month: ''
    },
    availableFilters: {
      categories: []
    },
    currentPage: 1,
    itemsPerPage: 9,
    
    async init() {
      try {
        // Fetch events data
        const response = await fetch('/events.json');
        this.events = await response.json();
        
        // Set initial filtered events
        this.filteredEvents = this.events;
        
        // Extract unique categories
        const allCategories = this.events.flatMap(event => event.categories || []);
        this.availableFilters.categories = [...new Set(allCategories)].sort();
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    },
    
    filter() {
      let result = this.events;
      
      // Filter by category
      if (this.filters.category) {
        result = result.filter(event => 
          event.categories && event.categories.includes(this.filters.category)
        );
      }
      
      // Filter by month
      if (this.filters.month) {
        result = result.filter(event => {
          if (!event.date) return false;
          const eventDate = new Date(event.date);
          const eventMonth = (eventDate.getMonth() + 1).toString().padStart(2, '0');
          return eventMonth === this.filters.month;
        });
      }
      
      // Apply search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(event => 
          event.title.toLowerCase().includes(query) || 
          (event.description && event.description.toLowerCase().includes(query))
        );
      }
      
      this.filteredEvents = result;
      this.currentPage = 1;
    },
    
    updateAvailableOptions(filtered) {
      // This could be implemented to dynamically update filter options
      // based on the current filtered results, but for simplicity we'll keep static options
    },
    
    search() {
      this.filter();
    },
    
    reset() {
      this.searchQuery = '';
      this.filters.category = '';
      this.filters.month = '';
      this.filteredEvents = this.events;
      this.currentPage = 1;
    },
    
    resetFilters() {
      this.reset();
    },
    
    formatMonth(monthStr) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = parseInt(monthStr, 10) - 1;
      return months[monthIndex];
    },
    
    formatDay(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-GB', { 
        day: 'numeric', 
        month: 'short'
      });
    },
    
    formatTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    },
    
    paginate() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredEvents.slice(startIndex, endIndex);
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.pageCount) {
        this.currentPage = page;
      }
    },
    
    get pageCount() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    },
    
    get pageNumbers() {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (this.pageCount <= maxVisiblePages) {
        // Show all pages if there are few
        for (let i = 1; i <= this.pageCount; i++) {
          pages.push(i);
        }
      } else {
        // Show a subset of pages with current page in the middle if possible
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.pageCount, startPage + maxVisiblePages - 1);
        
        // Adjust if we're near the end
        if (endPage === this.pageCount) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    },
    
    get paginatedEvents() {
      return this.paginate();
    },
    
    get startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    
    get endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage - 1, this.filteredEvents.length);
    },
    
    get isFiltered() {
      return this.searchQuery || this.filters.category || this.filters.month;
    }
  }));
});