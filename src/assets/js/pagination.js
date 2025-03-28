function initPagination(container, items, itemsPerPage = 12) {
  const paginationContainer = document.querySelector(container);
  if (!paginationContainer) return;
  
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page from URL or default to 1
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get('page') || '1');
  
  // Validate current page
  if (currentPage < 1 || currentPage > totalPages) {
    currentPage = 1;
  }
  
  // Calculate start and end indices
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Update pagination info text
  const paginationInfo = paginationContainer.querySelector('.pagination-info');
  if (paginationInfo) {
    paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} items`;
  }
  
  // Generate pagination numbers
  const paginationNumbers = paginationContainer.querySelector('.pagination-numbers');
  if (paginationNumbers) {
    paginationNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.appendChild(createPageNumberElement(i, currentPage));
      }
    } else {
      // Show a range of pages
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      // Adjust if at the end
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Add first page and ellipsis if needed
      if (startPage > 1) {
        paginationNumbers.appendChild(createPageNumberElement(1, currentPage));
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.classList.add('pagination-ellipsis');
          ellipsis.textContent = '...';
          paginationNumbers.appendChild(ellipsis);
        }
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        paginationNumbers.appendChild(createPageNumberElement(i, currentPage));
      }
      
      // Add last page and ellipsis if needed
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.classList.add('pagination-ellipsis');
          ellipsis.textContent = '...';
          paginationNumbers.appendChild(ellipsis);
        }
        paginationNumbers.appendChild(createPageNumberElement(totalPages, currentPage));
      }
    }
  }
  
  // Update prev/next buttons
  const prevButton = paginationContainer.querySelector('.pagination-prev');
  const nextButton = paginationContainer.querySelector('.pagination-next');
  
  if (prevButton) {
    if (currentPage === 1) {
      prevButton.classList.add('disabled');
      prevButton.removeAttribute('href');
    } else {
      prevButton.classList.remove('disabled');
      prevButton.href = createPageUrl(currentPage - 1);
    }
  }
  
  if (nextButton) {
    if (currentPage === totalPages) {
      nextButton.classList.add('disabled');
      nextButton.removeAttribute('href');
    } else {
      nextButton.classList.remove('disabled');
      nextButton.href = createPageUrl(currentPage + 1);
    }
  }
  
  // Return paginated items
  return items.slice(startIndex, endIndex);
}

function createPageNumberElement(pageNumber, currentPage) {
  const link = document.createElement('a');
  link.textContent = pageNumber;
  link.href = createPageUrl(pageNumber);
  link.classList.add('pagination-number');
  
  if (pageNumber === currentPage) {
    link.classList.add('active');
  }
  
  return link;
}

function createPageUrl(pageNumber) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  if (pageNumber === 1) {
    params.delete('page');
  } else {
    params.set('page', pageNumber);
  }
  
  url.search = params.toString();
  return url.toString();
}
