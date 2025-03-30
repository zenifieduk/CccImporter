/**
 * This file is responsible for merging event data from multiple sources.
 * It combines data from the events.js file with any event data stored in the /events directory.
 */

const events = [
  {
    id: 1,
    title: "Classic Car Show 2025",
    slug: "classic-car-show-2025",
    description: "The premier classic car event in the UK, featuring hundreds of vehicles from all eras.",
    date: "2025-05-15T10:00:00",
    endDate: "2025-05-17T18:00:00",
    location: {
      name: "Highnam Court",
      address: "Highnam Court, Highnam",
      city: "Gloucester",
      postcode: "GL2 8DG"
    },
    organizer: {
      name: "UK Classic Car Events",
      website: "https://www.ukclassiccars.co.uk",
      email: "info@ukclassiccars.co.uk",
      phone: "01234 567890"
    },
    categories: ["Show", "Competition", "Family"],
    featured: true,
    image: "/attached_assets/Classic-car-Poster-25.webp",
    ticketPrice: "£15 per adult, children under 12 free",
    website: "https://www.classiccarshow2025.com"
  },
  {
    id: 2,
    title: "Vintage Rally 2025",
    slug: "vintage-rally-2025",
    description: "A spectacular rally through the Scottish Highlands featuring pre-1960 vehicles.",
    date: "2025-06-10T08:00:00",
    endDate: "2025-06-14T18:00:00",
    location: {
      name: "Various Locations",
      address: "Starting from Inverness Castle",
      city: "Inverness",
      postcode: "IV2 3EG"
    },
    organizer: {
      name: "Scottish Heritage Motoring",
      website: "https://www.scottishheritagemotoring.org",
      email: "info@scottishheritagemotoring.org",
      phone: "01463 123456"
    },
    categories: ["Rally", "Vintage", "Competition"],
    featured: true,
    image: "/attached_assets/aston-martin-car-show.avif",
    ticketPrice: "£250 entry fee per vehicle, spectators free along route",
    website: "https://www.vintagerally2025.com"
  },
  {
    id: 3,
    title: "Pistons & Pretzels: German Car Festival",
    slug: "pistons-pretzels-german-car-festival",
    description: "Celebrating the best of German automotive engineering, with a focus on classic Mercedes, BMW, and Porsche models.",
    date: "2025-07-22T09:30:00",
    endDate: "2025-07-22T17:00:00",
    location: {
      name: "Donington Park Circuit",
      address: "Castle Donington",
      city: "Derby",
      postcode: "DE74 2RP"
    },
    organizer: {
      name: "German Classic Car Association",
      website: "https://www.germanclassiccars.org.uk",
      email: "events@germanclassiccars.org.uk",
      phone: "01332 987654"
    },
    categories: ["Show", "German", "Food Festival"],
    featured: true,
    image: "/attached_assets/pistons-pretzels.avif",
    ticketPrice: "£20 per adult, £10 for children under 16",
    website: "https://www.pistonsandpretzels.com"
  },
  {
    id: 4,
    title: "Summer Rally 2025",
    slug: "summer-rally-2025",
    description: "Annual summer rally organized by the Alvis Owners Club, featuring a picturesque drive through the Cotswolds.",
    date: "2025-07-05T09:00:00",
    endDate: "2025-07-05T17:00:00",
    location: {
      name: "Sudeley Castle",
      address: "Winchcombe",
      city: "Cheltenham",
      postcode: "GL54 5JD"
    },
    organizer: {
      name: "Alvis Owners Club",
      website: "https://alvisoc.org",
      email: "events@alvisoc.org",
      phone: "01926 856 760"
    },
    categories: ["Rally", "Club Event", "British"],
    featured: false,
    image: "/attached_assets/aston-martin-car-show.jpg",
    ticketPrice: "Free for club members, £10 for non-members",
    website: "https://alvisoc.org/events/summer-rally-2025"
  },
  {
    id: 5,
    title: "Autumn Drive 2025",
    slug: "autumn-drive-2025",
    description: "A spectacular autumn drive through the Lake District, organized by the Alvis Owners Club.",
    date: "2025-10-11T10:00:00",
    endDate: "2025-10-11T16:00:00",
    location: {
      name: "Windermere",
      address: "Starting from Brockhole Visitor Centre",
      city: "Windermere",
      postcode: "LA23 1LJ"
    },
    organizer: {
      name: "Alvis Owners Club",
      website: "https://alvisoc.org",
      email: "events@alvisoc.org",
      phone: "01926 856 760"
    },
    categories: ["Drive", "Club Event", "British"],
    featured: false,
    image: "/attached_assets/classic-car-event-group.avif",
    ticketPrice: "Free for club members, £5 for guests",
    website: "https://alvisoc.org/events/autumn-drive-2025"
  },
  {
    id: 6,
    title: "Annual Concours 2025",
    slug: "annual-concours-2025",
    description: "The prestigious annual concours organized by the Rolls-Royce Enthusiasts Club, featuring the finest examples of Rolls-Royce and Bentley automobiles.",
    date: "2025-06-20T09:00:00",
    endDate: "2025-06-21T17:00:00",
    location: {
      name: "Burghley House",
      address: "Stamford",
      city: "Lincolnshire",
      postcode: "PE9 3JY"
    },
    organizer: {
      name: "Rolls-Royce Enthusiasts Club",
      website: "https://rrec.org.uk",
      email: "events@rrec.org.uk",
      phone: "01327 811 788"
    },
    categories: ["Concours", "Club Event", "Luxury"],
    featured: true,
    image: "/attached_assets/car-rust-ad-1.jpg",
    ticketPrice: "£30 per adult, £15 for children under 16, free for RREC members",
    website: "https://rrec.org.uk/events/annual-concours-2025"
  }
];

// Export the merged events
function getEventsData() {
  return events;
}

module.exports = getEventsData();