document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const locationFilter = document.getElementById('locationFilter');
  const resetButton = document.getElementById('resetButton');
  const resultsContainer = document.getElementById('resultsContainer');
  const resultsCountElement = document.getElementById('resultsCount');
  const azFilterButtons = document.querySelectorAll('.az-filter-btn');
  
  // Get all data
  let allItems = [];
  if (resultsContainer) {
    allItems = JSON.parse(resultsContainer.dataset.items || '[]');
  }
  
  // Show initial results
  updateResults(allItems);
  
  // Search form submission
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim().toLowerCase();
      const category = categoryFilter.value;
      const location = locationFilter.value;
      
      filterResults(searchTerm, category, location);
    });
  }
  
  // Reset button
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (locationFilter) locationFilter.value = '';
      
      // Reset A-Z filters
      azFilterButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector('.az-filter-btn[data-letter="all"]')?.classList.add('active');
      
      updateResults(allItems);
    });
  }
  
  // A-Z filtering
  azFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const letter = this.dataset.letter;
      
      // Update active state
      azFilterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      if (letter === 'all') {
        // Reset other filters but keep search terms
        filterResults(searchInput.value.trim().toLowerCase(), categoryFilter.value, locationFilter.value);
      } else {
        // Filter by starting letter
        const filtered = allItems.filter(item => {
          const title = item.title || item.eventTitle || '';
          return title.toLowerCase().startsWith(letter.toLowerCase());
        });
        
        updateResults(filtered);
      }
    });
  });
  
  // Combined filter function
  function filterResults(searchTerm, category, location) {
    let filtered = [...allItems];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const title = item.title || item.eventTitle || '';
        const description = item.description || item.eventDescription || '';
        const itemCity = item.city || item.eventCity || '';
        const itemAddress = item.address || item.eventAddress || '';
        
        return (
          title.toLowerCase().includes(searchTerm) ||
          description.toLowerCase().includes(searchTerm) ||
          itemCity.toLowerCase().includes(searchTerm) ||
          itemAddress.toLowerCase().includes(searchTerm)
        );
      });
    }
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(item => {
        const itemCategory = item.category || item.eventCategory || '';
        
        if (Array.isArray(itemCategory)) {
          return itemCategory.some(cat => cat.toLowerCase() === category.toLowerCase());
        } else {
          return itemCategory.toLowerCase() === category.toLowerCase();
        }
      });
    }
    
    // Apply location filter
    if (location) {
      filtered = filtered.filter(item => {
        const itemCity = item.city || item.eventCity || '';
        const itemState = item.state || item.eventState || '';
        const itemAddress = item.address || item.eventAddress || '';
        
        return (
          itemCity.toLowerCase().includes(location.toLowerCase()) ||
          itemState.toLowerCase().includes(location.toLowerCase()) ||
          itemAddress.toLowerCase().includes(location.toLowerCase())
        );
      });
    }
    
    updateResults(filtered);
  }
  
  // Update results and count
  function updateResults(results) {
    // Update count display
    if (resultsCountElement) {
      resultsCountElement.textContent = `Showing ${results.length} ${results.length === 1 ? 'result' : 'results'}`;
    }
    
    // Check if Alpine.js is being used for rendering
    if (window.Alpine) {
      // Trigger Alpine update
      const alpineComponent = document.querySelector('[x-data]');
      if (alpineComponent && alpineComponent.__x) {
        alpineComponent.__x.updateData('filteredItems', results);
      }
    } else {
      // If not using Alpine, we'd need to manually update the DOM here
      // This implementation depends on your template structure
      if (resultsContainer && results.length > 0) {
        // Render items
        // This is a placeholder - actual implementation would depend on your DOM structure
      } else if (resultsContainer) {
        // Show "no results" message
        resultsContainer.innerHTML = `
          <div class="no-results">
            <h3>No results found</h3>
            <p>Please try adjusting your search criteria or reset the filters.</p>
          </div>
        `;
      }
    }
  }
});
