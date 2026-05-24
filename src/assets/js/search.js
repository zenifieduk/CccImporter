document.addEventListener('DOMContentLoaded', () => {
  // Initialize search functionality if we have a search form
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const searchTerm = this.querySelector('.search-term')?.value || '';
      const category = this.querySelector('.search-category')?.value || '';
      const location = this.querySelector('.search-location')?.value || '';
      
      // Build query string
      const urlParams = new URLSearchParams();
      if (searchTerm) urlParams.set('search', searchTerm);
      if (category) urlParams.set('category', category);
      if (location) urlParams.set('location', location);
      
      // Build redirect URL and append the hash for the club list section
      const basePath = window.location.pathname;
      const queryString = urlParams.toString() ? '?' + urlParams.toString() : '';
      const redirectUrl = basePath + queryString + '#results-section';
      
      // Redirect to search results with hash
      window.location.href = redirectUrl;
    });
    
    // Handle reset button
    const resetButton = searchForm.querySelector('.reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear form fields
        const fields = searchForm.querySelectorAll('input, select');
        fields.forEach(field => {
          field.value = '';
        });
        
        // Redirect to base URL
        window.location.href = window.location.pathname;
      });
    }
  }
  
  // Initialize A-Z filtering
  const azFilter = document.querySelector('.az-filter');
  if (azFilter) {
    const links = azFilter.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const letter = this.dataset.letter;
        
        // Get current URL params
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        
        // Toggle letter filter
        if (params.get('letter') === letter) {
          params.delete('letter');
        } else {
          params.set('letter', letter);
        }
        
        // Reset page
        params.delete('page');
        
        // Update URL with hash and reload
        url.search = params.toString();
        url.hash = '#results-section';
        window.location.href = url.toString();
      });
    });
  }
});
