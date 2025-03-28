document.addEventListener('DOMContentLoaded', function() {
  // Handle mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Initialize pagination
  const paginationLinks = document.querySelectorAll('.pagination-number, .pagination-arrow');
  
  paginationLinks.forEach(link => {
    if (!link.classList.contains('disabled')) {
      link.addEventListener('click', function(e) {
        // This is handled by the href, no need for JS unless you want to add animations
        // or prevent default and use AJAX instead
      });
    } else {
      link.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  });
  
  // Handle club category filters
  const categoryButtons = document.querySelectorAll('.category-filter-btn');
  if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.dataset.category;
        const searchParams = new URLSearchParams(window.location.search);
        
        if (category) {
          searchParams.set('category', category);
        } else {
          searchParams.delete('category');
        }
        
        window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
      });
    });
  }
  
  // Handle location filters with distance option
  const locationForm = document.getElementById('locationFilterForm');
  if (locationForm) {
    locationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const location = document.getElementById('locationInput').value;
      const distance = document.getElementById('distanceSelect').value;
      
      if (!location) return;
      
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('location', location);
      
      if (distance) {
        searchParams.set('distance', distance);
      } else {
        searchParams.delete('distance');
      }
      
      window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
    });
  }
});
