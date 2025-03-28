document.addEventListener('alpine:init', () => {
  Alpine.data('clubDirectory', () => ({
    items: [],
    filteredItems: [],
    searchTerm: '',
    selectedCategory: '',
    selectedLocation: '',
    currentLetter: 'all',
    
    init() {
      // Get items from the data attribute
      const container = document.getElementById('resultsContainer');
      if (container) {
        this.items = JSON.parse(container.dataset.items || '[]');
        this.filteredItems = [...this.items];
      }
      
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      this.searchTerm = urlParams.get('search') || '';
      this.selectedCategory = urlParams.get('category') || '';
      this.selectedLocation = urlParams.get('location') || '';
      this.currentLetter = urlParams.get('letter') || 'all';
      
      // Apply filters from URL parameters
      this.applyFilters();
    },
    
    applyFilters() {
      let results = [...this.items];
      
      // Apply search term filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        results = results.filter(item => {
          const title = item.title || item.eventTitle || '';
          const description = item.description || item.eventDescription || '';
          const itemCity = item.city || item.eventCity || '';
          const itemAddress = item.address || item.eventAddress || '';
          
          return (
            title.toLowerCase().includes(term) ||
            description.toLowerCase().includes(term) ||
            itemCity.toLowerCase().includes(term) ||
            itemAddress.toLowerCase().includes(term)
          );
        });
      }
      
      // Apply category filter
      if (this.selectedCategory) {
        results = results.filter(item => {
          const itemCategory = item.category || item.eventCategory || '';
          
          if (Array.isArray(itemCategory)) {
            return itemCategory.some(cat => cat.toLowerCase() === this.selectedCategory.toLowerCase());
          } else {
            return itemCategory.toLowerCase() === this.selectedCategory.toLowerCase();
          }
        });
      }
      
      // Apply location filter
      if (this.selectedLocation) {
        results = results.filter(item => {
          const itemCity = item.city || item.eventCity || '';
          const itemState = item.state || item.eventState || '';
          const itemAddress = item.address || item.eventAddress || '';
          
          return (
            itemCity.toLowerCase().includes(this.selectedLocation.toLowerCase()) ||
            itemState.toLowerCase().includes(this.selectedLocation.toLowerCase()) ||
            itemAddress.toLowerCase().includes(this.selectedLocation.toLowerCase())
          );
        });
      }
      
      // Apply A-Z filter
      if (this.currentLetter !== 'all') {
        results = results.filter(item => {
          const title = item.title || item.eventTitle || '';
          return title.toLowerCase().startsWith(this.currentLetter.toLowerCase());
        });
      }
      
      this.filteredItems = results;
    },
    
    resetFilters() {
      this.searchTerm = '';
      this.selectedCategory = '';
      this.selectedLocation = '';
      this.currentLetter = 'all';
      this.filteredItems = [...this.items];
      
      // Also reset form inputs
      document.getElementById('searchInput').value = '';
      document.getElementById('categoryFilter').value = '';
      document.getElementById('locationFilter').value = '';
      
      // Reset A-Z filter buttons
      const azButtons = document.querySelectorAll('.az-filter-btn');
      azButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector('.az-filter-btn[data-letter="all"]')?.classList.add('active');
    },
    
    filterByLetter(letter) {
      this.currentLetter = letter;
      
      // Update active state for buttons
      const azButtons = document.querySelectorAll('.az-filter-btn');
      azButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector(`.az-filter-btn[data-letter="${letter}"]`)?.classList.add('active');
      
      this.applyFilters();
    }
  }));
  
  Alpine.data('eventDirectory', () => ({
    events: [],
    filteredEvents: [],
    searchTerm: '',
    selectedCategory: '',
    selectedLocation: '',
    
    init() {
      // Get events from the data attribute
      const container = document.getElementById('eventsContainer');
      if (container) {
        this.events = JSON.parse(container.dataset.events || '[]');
        this.filteredEvents = [...this.events];
      }
      
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      this.searchTerm = urlParams.get('search') || '';
      this.selectedCategory = urlParams.get('category') || '';
      this.selectedLocation = urlParams.get('location') || '';
      
      // Apply filters from URL parameters
      this.applyFilters();
    },
    
    applyFilters() {
      let results = [...this.events];
      
      // Apply search term filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        results = results.filter(event => 
          event.eventTitle.toLowerCase().includes(term) ||
          (event.eventDescription && event.eventDescription.toLowerCase().includes(term)) ||
          (event.eventCity && event.eventCity.toLowerCase().includes(term)) ||
          (event.eventAddress && event.eventAddress.toLowerCase().includes(term))
        );
      }
      
      // Apply category filter
      if (this.selectedCategory) {
        results = results.filter(event => {
          if (Array.isArray(event.eventCategory)) {
            return event.eventCategory.some(cat => cat.toLowerCase() === this.selectedCategory.toLowerCase());
          } else {
            return event.eventCategory && event.eventCategory.toLowerCase() === this.selectedCategory.toLowerCase();
          }
        });
      }
      
      // Apply location filter
      if (this.selectedLocation) {
        results = results.filter(event => 
          (event.eventCity && event.eventCity.toLowerCase().includes(this.selectedLocation.toLowerCase())) ||
          (event.eventState && event.eventState.toLowerCase().includes(this.selectedLocation.toLowerCase())) ||
          (event.eventAddress && event.eventAddress.toLowerCase().includes(this.selectedLocation.toLowerCase()))
        );
      }
      
      this.filteredEvents = results;
    },
    
    resetFilters() {
      this.searchTerm = '';
      this.selectedCategory = '';
      this.selectedLocation = '';
      this.filteredEvents = [...this.events];
      
      // Also reset form inputs
      document.getElementById('searchInput').value = '';
      document.getElementById('categoryFilter').value = '';
      document.getElementById('locationFilter').value = '';
    }
  }));
});
