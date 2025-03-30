/**
 * This file is responsible for merging club data from multiple sources.
 * It combines data from the clubs.js file with any club data stored in the /clubs directory.
 */

const clubs = [
  {
    id: 1,
    name: "Alvis Owners Club",
    slug: "alvis-owners-club-888",
    description: "The Alvis Owners Club is a club for enthusiasts and owners of these fine British cars, manufactured between 1920 and 1967.",
    fullDescription: "# Alvis Owners Club\n\nWelcome to the Alvis Owners Club, established in 1951 to bring together enthusiasts of Alvis cars. The club caters for all Alvis models from the earliest 10/30 to the last TF21 and the 3-litre models developed under Rover's direction. We provide a friendly and supportive community for owners of these fine British automobiles.\n\n## Our Activities\n\nThe club organizes a variety of events throughout the year, including national rallies, technical workshops, and social gatherings. Members benefit from our extensive library of technical information, our quarterly publication 'The Bulletin', and access to our comprehensive spare parts service.\n\n## History of Alvis\n\nAlvis cars were manufactured in Coventry, England between 1920 and 1967. The company was known for its quality engineering and innovative designs. During the 1920s and 1930s, Alvis produced some of the finest sporting cars of the era, including the Speed 20 and Speed 25 models. Post-war models such as the TC21/100 Grey Lady and the TD/TF series continued the tradition of engineering excellence combined with luxurious appointments.\n\n## Joining the Club\n\nMembership is open to all Alvis enthusiasts, whether you currently own an Alvis or simply appreciate these remarkable cars. For more details on membership benefits and how to join, please contact us through our official website.",
    founded: 1951,
    memberCount: 1450,
    categories: ["Classic", "British", "Pre-war", "Post-war"],
    location: {
      address: "The Old Mill",
      city: "Kenilworth",
      county: "Warwickshire",
      postcode: "CV8 1NG"
    },
    contact: {
      email: "membership@alvisoc.org",
      phone: "01926 856 760",
      website: "https://alvisoc.org"
    },
    social: {
      facebook: "https://www.facebook.com/alvisownersclub",
      twitter: "https://twitter.com/alvisowners",
      instagram: "https://www.instagram.com/alvisownersclub"
    },
    featured: true,
    image: "/attached_assets/alvis-owners-club.jpg",
    upcomingEvents: ["summer-rally-2025", "autumn-drive-2025"],
    membershipFee: "£45 per year"
  },
  {
    id: 2,
    name: "Rolls-Royce Enthusiasts Club",
    slug: "rolls-royce-enthusiasts-club-889",
    description: "The Rolls-Royce Enthusiasts' Club caters for anyone with an interest in Rolls-Royce and Bentley motor cars.",
    fullDescription: "# Rolls-Royce Enthusiasts Club\n\nFounded in 1957, the Rolls-Royce Enthusiasts' Club (RREC) is one of the world's largest clubs dedicated to the marques of Rolls-Royce and Bentley. With over 10,000 members worldwide, the club provides a wealth of resources, events, and camaraderie for those passionate about these prestigious automobiles.\n\n## Our Mission\n\nThe RREC aims to preserve and promote the heritage of Rolls-Royce and Bentley motor cars. We provide technical support, historical information, and social events for owners and enthusiasts alike. Our extensive archive and library house a wealth of documentation, technical drawings, and historical records that are invaluable resources for members.\n\n## Events and Activities\n\nThe club organizes numerous events throughout the year, including the Annual Rally and Concours d'Elegance, technical seminars, driving tours, and social gatherings. Our international network of sections ensures that there are activities happening across the globe, providing opportunities for members to enjoy their cars and meet fellow enthusiasts.\n\n## Publications\n\nThe club produces a highly regarded bi-monthly magazine, 'The Spirit', which features articles on historical aspects of the marques, technical advice, event reports, and classified advertisements. Additionally, we publish books, technical manuals, and other resources that help members maintain and enjoy their cars.\n\n## Joining the Club\n\nMembership is open to anyone with an interest in Rolls-Royce and Bentley motor cars, regardless of whether they currently own one. Benefits include access to our publications, events, technical support, and the camaraderie of fellow enthusiasts.",
    founded: 1957,
    memberCount: 10000,
    categories: ["Luxury", "British", "Pre-war", "Post-war"],
    location: {
      address: "The Hunt House, High Street",
      city: "Paulerspury",
      county: "Northamptonshire",
      postcode: "NN12 7NA"
    },
    contact: {
      email: "membership@rrec.org.uk",
      phone: "01327 811 788",
      website: "https://rrec.org.uk"
    },
    social: {
      facebook: "https://www.facebook.com/RRECUK",
      twitter: "https://twitter.com/RRECinfo",
      instagram: "https://www.instagram.com/rollsroyceenthusiastsclub"
    },
    featured: true,
    image: "/attached_assets/Screenshot 2025-03-30 at 13.35.26.png",
    upcomingEvents: ["annual-concours-2025", "international-rally-2025"],
    membershipFee: "£95 per year"
  },
  {
    id: 3,
    name: "Club Peugeot UK",
    slug: "club-peugeot-uk-896",
    description: "Club Peugeot UK is dedicated to enthusiasts of all Peugeot models, from vintage to modern.",
    fullDescription: "# Club Peugeot UK\n\nFounded in 1981, Club Peugeot UK brings together enthusiasts of all Peugeot models. Whether you own a classic 205 GTi, a modern 508, or anything in between, our club welcomes all Peugeot owners and enthusiasts.\n\n## Club Activities\n\nWe organize a variety of events throughout the year, including regional meets, national rallies, track days, and social gatherings. Our annual 'Peugeot Festival' is the highlight of our calendar, bringing together hundreds of Peugeot cars from across the UK and Europe.\n\n## Technical Support\n\nOur members benefit from a wealth of technical knowledge within the club. Our forums and technical officers can provide advice on maintenance, restoration, and modifications. We also maintain a list of Peugeot specialists and parts suppliers.\n\n## Publications\n\nOur bi-monthly magazine, 'The Lion', features articles on Peugeot history, technical guides, event reports, and member showcases. We also have an active online presence with forums, social media groups, and a resource-rich website.\n\n## Joining the Club\n\nMembership is open to all Peugeot enthusiasts. Benefits include discounts from partnered suppliers, access to club events, technical support, and our magazine. We have regional groups across the UK, so there's likely to be fellow members near you.",
    founded: 1981,
    memberCount: 3200,
    categories: ["European", "French", "Modern", "Vintage"],
    location: {
      address: "45 Lion Street",
      city: "Reading",
      county: "Berkshire",
      postcode: "RG1 7PL"
    },
    contact: {
      email: "info@clubpeugeotuk.org",
      phone: "0118 986 4230",
      website: "https://www.clubpeugeotuk.org"
    },
    social: {
      facebook: "https://www.facebook.com/ClubPeugeotUK",
      twitter: "https://twitter.com/ClubPeugeotUK",
      instagram: "https://www.instagram.com/clubpeugeotuk"
    },
    featured: false,
    image: "/attached_assets/club-peugeot.jpg",
    upcomingEvents: ["peugeot-festival-2025", "french-car-day-2025"],
    membershipFee: "£35 per year"
  },
  {
    id: 4,
    name: "Ford Classic and Capri Owners Club",
    slug: "ford-classic-and-capri-owners-club-897",
    description: "A vibrant community for owners and enthusiasts of Ford Classic and Capri models, providing support, events, and camaraderie.",
    fullDescription: "# Ford Classic and Capri Owners Club\n\nEstablished in 1970, the Ford Classic and Capri Owners Club is dedicated to the preservation and enjoyment of these iconic Ford models. Our club brings together enthusiasts of the Ford Consul Classic (1961-1963), the Consul Capri (1961-1964), and all generations of the legendary Ford Capri (1969-1986).\n\n## Our Purpose\n\nThe club aims to preserve these important vehicles for future generations, provide technical support and advice to owners, and create a social network of like-minded enthusiasts. We welcome everyone from restoration specialists to daily drivers, and from concours perfectionists to modified enthusiasts.\n\n## Club Activities\n\nWe organize numerous events throughout the year including regional meets, national rallies, show presence, and technical workshops. Our annual 'Classic and Capri Day' is particularly popular, drawing hundreds of vehicles from across the country.\n\n## Technical Resources\n\nOur club maintains an extensive archive of technical information, parts lists, and workshop manuals. Members have access to our technical advisors who can provide guidance on maintenance, restoration, and sourcing of parts. We also have relationships with specialist suppliers who offer discounts to club members.\n\n## Publications\n\nOur quarterly magazine, 'Classic Lines', features restoration stories, technical articles, historical features, and event coverage. We also maintain an active online forum where members can share advice, photos, and experiences.\n\n## Joining the Club\n\nMembership is open to owners and enthusiasts of the Ford Classic and Capri models. You don't need to own one of these cars to join – an interest and enthusiasm for these models is all that's required.",
    founded: 1970,
    memberCount: 2500,
    categories: ["Classic", "British", "Ford", "1960s", "1970s", "1980s"],
    location: {
      address: "Ford Heritage Centre",
      city: "Dagenham",
      county: "Essex",
      postcode: "RM9 6SA"
    },
    contact: {
      email: "membership@fccoc.org.uk",
      phone: "01234 567890",
      website: "https://www.fccoc.org.uk"
    },
    social: {
      facebook: "https://www.facebook.com/FordClassicCapriOwnersClub",
      twitter: "https://twitter.com/FordCapriClub",
      instagram: "https://www.instagram.com/fordclassiccapriclub"
    },
    featured: false,
    image: "/attached_assets/screenshot-1743266603550.png",
    upcomingEvents: ["capri-day-2025", "ford-heritage-show-2025"],
    membershipFee: "£30 per year"
  },
  {
    id: 5,
    name: "Classic Car Club London",
    slug: "classic-car-club-london-898",
    description: "A unique club offering members the opportunity to drive a remarkable collection of iconic classic and sports cars without the hassles of ownership.",
    fullDescription: "# Classic Car Club London\n\nFounded in 1995, the Classic Car Club London pioneered an innovative concept: a membership club that gives enthusiasts access to a spectacular fleet of classic and performance cars without the responsibilities of ownership. Located in a stunning showroom on the banks of the Thames, our club offers a unique opportunity to drive the cars of your dreams.\n\n## Our Philosophy\n\nWe believe that classic cars should be driven and enjoyed, not just admired in museums or private collections. Our club makes it possible for members to experience a wide range of automotive icons throughout the year, from vintage British sports cars to modern supercars.\n\n## The Fleet\n\nOur carefully curated collection includes over 40 vehicles spanning eight decades of automotive excellence. Members can enjoy everything from a 1960s Jaguar E-Type to a modern Porsche 911, and from a classic Mini Cooper to a Ferrari 458. The fleet is constantly evolving to include new and exciting additions.\n\n## Membership Benefits\n\nBeyond access to our remarkable fleet, membership includes invitations to exclusive events, rallies, and road trips. Our clubhouse serves as a social hub where members can connect with fellow enthusiasts, participate in themed evenings, and attend talks by industry figures.\n\n## How It Works\n\nMembers purchase points which they can exchange for time with different vehicles in the collection. Each car is assigned a point value based on its rarity, value, and demand. This system allows members to tailor their experience according to their preferences and budget.\n\n## Joining the Club\n\nMembership is limited to ensure availability of cars and maintain our high standards of service. Prospective members are invited to visit our showroom for a tour and introduction to the club concept. Various membership tiers are available to suit different levels of usage.",
    founded: 1995,
    memberCount: 500,
    categories: ["Driving Club", "Luxury", "Sports Cars", "Classic", "Modern"],
    location: {
      address: "The Peninsular, Wharf Road",
      city: "London",
      county: "",
      postcode: "N1 7GR"
    },
    contact: {
      email: "info@classiccarclublondon.co.uk",
      phone: "020 7490 9090",
      website: "https://www.classiccarclublondon.co.uk"
    },
    social: {
      facebook: "https://www.facebook.com/classiccarclublondon",
      twitter: "https://twitter.com/ClassicCarClubL",
      instagram: "https://www.instagram.com/classiccarclublondon"
    },
    featured: true,
    image: "/attached_assets/classic-car-club-london.jpg",
    upcomingEvents: ["summer-drive-2025", "goodwood-revival-trip-2025"],
    membershipFee: "From £3,500 per year"
  },
  {
    id: 6,
    name: "Range Rover Register",
    slug: "range-rover-register-899",
    description: "The Range Rover Register is the premier club for enthusiasts of classic and modern Range Rover vehicles.",
    founded: 1985,
    memberCount: 2200,
    categories: ["British", "4x4", "Luxury", "Classic", "Modern"],
    contact: {
      email: "info@rangeroverregister.org",
      phone: "01234 123456",
      website: "https://www.rangeroverregister.org"
    },
    featured: false,
    upcomingEvents: ["off-road-challenge-2025", "range-rover-anniversary-meet-2025"]
  }
];

// Export the merged clubs
function getClubsData() {
  return clubs;
}

module.exports = getClubsData();