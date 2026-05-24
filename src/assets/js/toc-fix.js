/**
 * Table of Contents link fixing script
 * This script helps fix broken anchor links in the table of contents
 * by matching headings with similar text content if the exact ID match fails.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Handle clicks on anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      // If target exists, scroll to it
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Try to find heading with similar text content
        const allHeadings = document.querySelectorAll('h2, h3, h4, h5, h6');
        for (const heading of allHeadings) {
          const headingText = heading.textContent.trim().toLowerCase();
          const linkText = this.textContent.trim().toLowerCase();
          
          // If heading text contains link text, use this as fallback
          if (headingText === linkText || headingText.includes(linkText)) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
            // Add the ID to the heading to support sharing links
            if (!heading.id) {
              heading.id = targetId;
            }
            break;
          }
        }
      }
    });
  });
}); 