/**
 * Global site configuration
 */

module.exports = {
  // Site details
  title: "Classic Car Clubs Directory",
  description: "Find and join classic car clubs across the UK and worldwide. Discover events, connect with fellow enthusiasts, and celebrate classic motoring heritage.",
  url: "https://classiccars.club",
  
  // Header navigation
  nav: [
    {
      text: "Home",
      url: "/"
    },
    {
      text: "Club Directory",
      url: "/club-directory/"
    },
    {
      text: "Events",
      url: "/club-events/"
    },
    {
      text: "About Us",
      url: "/about/"
    },
    {
      text: "Contact",
      url: "/contact/"
    }
  ],
  
  // Footer navigation (including pages not in main nav)
  footerNav: [
    {
      text: "Privacy Policy",
      url: "/privacy-policy/"
    },
    {
      text: "Terms of Service",
      url: "/terms-of-service/"
    },
    {
      text: "Club Website Design",
      url: "/club-website-design/"
    },
    {
      text: "Advertise With Us",
      url: "/advertise/"
    },
    {
      text: "FAQ",
      url: "/faq/"
    }
  ],
  
  // Social media links
  social: {
    facebook: "https://www.facebook.com/classiccarclubs",
    twitter: "https://twitter.com/classiccarclubs",
    instagram: "https://www.instagram.com/classiccarclubs"
  },
  
  // Featured categories for filtering
  featuredCategories: [
    "British",
    "American",
    "European",
    "German",
    "Italian",
    "French",
    "Japanese",
    "Pre-war",
    "Post-war",
    "Modern",
    "Vintage",
    "Classic",
    "Sports",
    "Luxury"
  ],
  
  // Event types
  eventTypes: [
    "Show",
    "Rally",
    "Concours",
    "Race",
    "Meeting",
    "Drive",
    "Workshop",
    "Exhibition",
    "Competition",
    "Auction"
  ],
  
  // SEO and Open Graph
  defaultImage: "/assets/images/classic-car-clubs-og.jpg",
  twitterHandle: "@classiccarclubs",
  
  // Contact information
  contact: {
    email: "info@classiccars.club",
    phone: "01234 567890",
    address: "123 Classic Lane, Vintage Town, UK, AB12 3CD"
  },
  
  // Copyright
  copyright: "© Classic Car Clubs " + new Date().getFullYear()
};