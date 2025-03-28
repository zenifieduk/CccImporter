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
        
        // Apply filters
        this.filter();
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error initializing search:', error);
        this.isLoading = false;
      }
    },
    
    filter() {
      let filtered = [...this.clubs];
      
      // Filter by search term
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(club => 
          club.title.toLowerCase().includes(term) ||
          (club.city && club.city.toLowerCase().includes(term)) ||
          (club.state && club.state.toLowerCase().includes(term))
        );
      }
      
      // Filter by category
      if (this.category) {
        filtered = filtered.filter(club => 
          club.category && club.category.toLowerCase() === this.category.toLowerCase()
        );
      }
      
      // Filter by location
      if (this.location) {
        filtered = filtered.filter(club => 
          (club.city && club.city.toLowerCase().includes(this.location.toLowerCase())) ||
          (club.state && club.state.toLowerCase().includes(this.location.toLowerCase()))
        );
      }
      
      // Filter by letter
      if (this.letter) {
        filtered = filtered.filter(club => 
          club.title.toLowerCase().startsWith(this.letter.toLowerCase())
        );
      }
      
      this.filteredClubs = filtered;
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
    },
    
    reset() {
      this.searchTerm = '';
      this.category = '';
      this.location = '';
      this.letter = '';
      
      // Update URL
      window.history.pushState({}, '', window.location.pathname);
      
      this.filter();
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
        console.error('Error initializing search:', error);
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
    }
  }));
  
  Alpine.data('pagination', () => ({
    currentPage: 1,
    itemsPerPage: 12,
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
