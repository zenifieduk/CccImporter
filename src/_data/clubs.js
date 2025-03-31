const origClubs = require('./clubs-orig.js');

// Add description field for each club
function enhanceClubData(club) {
  return {
    ...club,
    description: `${club.title} is a car club${club.city ? ` based in ${club.city}` : ''}.`,
    featured: false
  };
}

module.exports = function() {
  // Enhance the club data with descriptions and featured flags
  const originalClubs = origClubs.map(enhanceClubData);
  
  // Add some manually curated clubs with images
  const curatedClubs = [
    {
      title: "North West Casual Classics",
      website: "https://www.northwestcasualclassics.com",
      address: "123 Main Street, Warrington, WA1 1AA",
      phone: "01925 123456",
      email: "info@northwestcasualclassics.com",
      city: "Warrington",
      postalCode: "WA1 1AA",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/northwest-casual-classics.jpg",
      category: "Car Club",
      state: "Cheshire",
      slug: "north-west-casual-classics",
      featured: true,
      description: "North West Casual Classics is a friendly club dedicated to the preservation and enjoyment of classic vehicles in the North West of England.",
      marque: "Various"
    },
    {
      title: "The Military Vehicle Trust",
      website: "https://www.mvt.org.uk",
      address: "The Secretary, Military Vehicle Trust, PO Box 1, Northampton NN7 2ZR",
      phone: "0800 123 4567",
      email: "secretary@mvt.org.uk",
      city: "Northampton",
      postalCode: "NN7 2ZR", 
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/military-vehicle-trust.jpg",
      category: "Car Club",
      state: "Northamptonshire",
      slug: "the-military-vehicle-trust",
      featured: true,
      description: "The Military Vehicle Trust is dedicated to the preservation and public display of military vehicles and equipment.",
      marque: "Military"
    },
    {
      title: "Vintage Hot Rod Association",
      website: "https://www.vhra.co.uk",
      address: "VHRA, PO Box 123, Colchester, CO1 1AB",
      phone: "01206 123456",
      email: "info@vhra.co.uk",
      city: "Colchester",
      postalCode: "CO1 1AB",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/vintage-hotrod-association.jpg",
      category: "Hot Rod Club",
      state: "Essex",
      slug: "vintage-hot-rod-association",
      featured: true,
      description: "The Vintage Hot Rod Association is dedicated to period-correct hot rods and custom cars built in the traditional style.",
      marque: "Hot Rod"
    },
    {
      title: "The Classic Car Club",
      website: "https://www.theclassiccarclub.co.uk",
      address: "123 High Street, London, EC1V 1LT",
      phone: "020 7123 4567",
      email: "info@theclassiccarclub.co.uk",
      city: "London",
      postalCode: "EC1V 1LT",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/featured-image-1.jpg",
      category: "Car Club",
      state: "London",
      slug: "the-classic-car-club",
      featured: true,
      description: "The Classic Car Club is dedicated to the preservation and enjoyment of classic cars from all eras.",
      marque: "Various"
    },
    {
      title: "Standard Motor Club",
      website: "https://www.standardmotorclub.org.uk",
      address: "Standard Motor Club, PO Box 123, Bath, BA1 1AA",
      phone: "01225 123456",
      email: "secretary@standardmotorclub.org.uk",
      city: "Bath",
      postalCode: "BA1 1AA",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/standard-motor-club.jpg",
      category: "Car Club",
      state: "Somerset",
      slug: "standard-motor-club",
      featured: true,
      description: "The Standard Motor Club caters for all Standard cars manufactured between 1903 and 1963.",
      marque: "Standard"
    },
    {
      title: "Strathmore Vintage Vehicle Club",
      website: "https://www.svvc.co.uk",
      address: "The Bridge, Glamis Road, Forfar, DD8 1FR",
      phone: "01307 123456",
      email: "info@svvc.co.uk",
      city: "Forfar",
      postalCode: "DD8 1FR",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/strathmore-vintage-vehicle-club.jpg",
      category: "Car Club",
      state: "Angus",
      slug: "strathmore-vintage-vehicle-club",
      featured: true,
      description: "The Strathmore Vintage Vehicle Club is dedicated to the preservation and restoration of vintage vehicles of all types.",
      marque: "Various"
    },
    {
      title: "The Automobile Club of North Wales",
      website: "https://www.acnw.org.uk",
      address: "123 High Street, Pwllheli, LL53 5AA",
      phone: "01758 123456",
      email: "secretary@acnw.org.uk",
      city: "Pwllheli",
      postalCode: "LL53 5AA",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/the-automobile-club-north-wales.jpg",
      category: "Car Club",
      state: "Gwynedd",
      slug: "the-automobile-club-of-north-wales",
      featured: true,
      description: "The Automobile Club of North Wales is a friendly club for enthusiasts of all types of classic and vintage vehicles.",
      marque: "Various"
    },
    {
      title: "Alvis Owners Club",
      website: "https://www.alvisoc.org",
      address: "Alvis Owners Club, PO Box 153, Lichfield, WS13 8YF",
      phone: "01543 267301",
      email: "general.secretary@alvisoc.org",
      city: "Lichfield",
      postalCode: "WS13 8YF",
      countryCode: "GB",
      imageUrl: "/assets/images/alvis-owners-club.jpg",
      category: "Car Club",
      state: "Staffordshire",
      slug: "alvis-owners-club",
      featured: true,
      description: "The Alvis Owner Club was founded in 1951 to encourage the preservation and continued use of all Alvis cars.",
      marque: "Alvis"
    },
    {
      title: "Rolls-Royce Enthusiasts' Club",
      website: "https://rrec.org.uk/",
      address: "The Hunt House, Paulerspury, Northants, NN12 7NA",
      phone: "+44(1327)811788",
      email: "hello@rrec.org.uk",
      city: "Paulerspury",
      postalCode: "NN12 7NA",
      countryCode: "GB",
      imageUrl: "/assets/images/rolls-royce-enthusiasts.jpg",
      category: "Car Club",
      state: "Northamptonshire",
      slug: "rolls-royce-enthusiasts-club",
      featured: true,
      description: "The Rolls-Royce Enthusiasts' Club is a worldwide organisation dedicated to the preservation and promotion of Rolls-Royce and Bentley motor cars.",
      marque: "Rolls-Royce"
    },
    {
      title: "Rolls-Royce Enthusiasts' Wessex Section",
      website: "https://rrecwessex.org.uk/",
      address: "",
      phone: "079765 70036",
      email: "secretary@rrecwessex.org.uk",
      city: "",
      postalCode: "",
      countryCode: "GB",
      imageUrl: "/assets/images/rolls-royce-enthusiasts-wessex.jpg",
      category: "Car Club",
      state: "Wessex",
      slug: "rolls-royce-enthusiasts-club-wessex",
      description: "The Wessex Section of the Rolls-Royce Enthusiasts' Club, serving members in the South West of England.",
      marque: "Rolls-Royce"
    },
    {
      title: "Rover P4 Drivers' Guild",
      website: "https://www.roverp4dg.org.uk",
      address: "Paddock Bend, 60 Stratford Road, Cosgrove, Northants, MK19 7BD.",
      phone: "",
      email: "",
      city: "Northants",
      postalCode: "MK19 7BD",
      countryCode: "GB",
      imageUrl: "/assets/images/rover-p4-club.jpg",
      category: "Car Club",
      state: "",
      slug: "rover-p4-drivers-guild",
      description: "The Rover P4 Drivers Guild caters for owners and enthusiasts of the Rover P4 models manufactured between 1949 and 1964.",
      marque: "Rover"
    },
    {
      title: "Rover SDI Club",
      website: "https://www.roversd1club.net",
      address: "The Rover SDI Club, PO Box 2841, Hawksworth, Swindon, SN2 1WS.",
      phone: "0845 306230",
      email: "",
      city: "Swindon",
      postalCode: "SN2 1WS",
      countryCode: "GB",
      imageUrl: "/assets/images/rover-sdi-club.jpg",
      category: "Car Club",
      state: "",
      slug: "rover-sdi-club",
      description: "The Rover SDI Club is dedicated to the preservation and enjoyment of the Rover SD1 range of cars manufactured from 1976 to 1986.",
      marque: "Rover"
    },
    {
      title: "Rolls-Royce Enthusiasts' Club - Surrey Section",
      website: "https://www.rrec-surrey.uk/",
      address: "Melrose Cottage, Cranleigh Road, Ewhurst, Surrey GU6 7RJ",
      phone: "01483 271853",
      email: "secretary@rrec-surrey.uk",
      city: "Surrey GU6 7RJ",
      postalCode: "GU6 7RJ",
      countryCode: "GB",
      imageUrl: "/assets/images/rolls-royce-surrey.jpg",
      category: "Car Club",
      state: "Surrey",
      slug: "rolls-royce-enthusiasts-club-surrey-section",
      description: "The Surrey Section of the Rolls-Royce Enthusiasts' Club, serving members in the Surrey region.",
      marque: "Rolls-Royce"
    },
    {
      title: "Rover P6 Owners Club",
      website: "https://www.p6roc.com",
      address: "Wood Nook Farm, 2 Huddersfield Road, Shelley, Huddersfield, HD8 8HJ",
      phone: "01484 607772",
      email: "",
      city: "Huddersfield",
      postalCode: "HD8 8HJ",
      countryCode: "GB",
      imageUrl: "/assets/images/rover-p6-club.jpg",
      category: "Car Club",
      state: "",
      slug: "rover-p6-owners-club",
      featured: true,
      description: "The Rover P6 Owners Club supports owners and enthusiasts of the Rover 2000, 2200 and 3500 models produced between 1963 and 1977.",
      marque: "Rover"
    },
    {
      title: "Rover P5 Owners Club",
      website: "https://www.roverp5club.org.uk",
      address: "Membership Secretary Rover P5 Club, 13 Glen Avenue, Ashford, Middlesex, TW15 2JE, United Kingdom.",
      phone: "01784 258166",
      email: "",
      city: "Ashford",
      postalCode: "TW15 2JE",
      countryCode: "GB",
      imageUrl: "/assets/images/rover-p5-club.jpg",
      category: "Car Club",
      state: "",
      slug: "rover-p5-owners-club",
      description: "The Rover P5 Club is dedicated to the preservation and use of Rover P5 and P5B models produced between 1958 and 1973.",
      marque: "Rover"
    },
    {
      title: "Club Peugeot UK",
      website: "https://www.peugeotclub.org",
      address: "4 The Paddocks, York, North Yorkshire YO32 9GW",
      phone: "01904 784833",
      email: "info@peugeotclub.org",
      city: "York",
      postalCode: "YO32 9GW",
      countryCode: "GB",
      imageUrl: "/assets/images/club-peugeot.jpg",
      category: "Car Club",
      state: "North Yorkshire",
      slug: "club-peugeot-uk",
      featured: true,
      description: "Club Peugeot UK is the official club for all Peugeot enthusiasts, covering all models from vintage to modern.",
      marque: "Peugeot"
    },
    {
      title: "Ford Classic and Capri Owners Club",
      website: "https://www.fccoc.org.uk",
      address: "1 Manor Close, Colchester CO4 3DJ",
      phone: "01206 240678",
      email: "secretary@fccoc.org.uk",
      city: "Colchester",
      postalCode: "CO4 3DJ",
      countryCode: "GB",
      imageUrl: "/assets/images/ford-classic-capri.jpg",
      category: "Car Club",
      state: "Essex",
      slug: "ford-classic-and-capri-owners-club",
      featured: true,
      description: "The Ford Classic and Capri Owners Club caters for the Ford Consul Classic, Consul Capri and all models of Ford Capri.",
      marque: "Ford"
    },
    {
      title: "Classic Car Club London",
      website: "https://www.classiccarclublondon.co.uk",
      address: "The Brewery Building, 16 Brewhouse Yard, London, EC1V 4LJ",
      phone: "020 7490 9090",
      email: "info@classiccarclublondon.co.uk",
      city: "London",
      postalCode: "EC1V 4LJ",
      countryCode: "GB",
      imageUrl: "/assets/images/classic-car-club-london.jpg",
      category: "Car Club",
      state: "London",
      slug: "classic-car-club-london",
      featured: true,
      description: "Classic Car Club London offers membership-based access to a fleet of iconic classic and performance cars in the heart of London.",
      marque: "Various"
    },
    {
      title: "Range Rover Register",
      website: "https://www.rangeroverregister.org",
      address: "PO Box 251, Cranleigh, Surrey GU6 8WP",
      phone: "",
      email: "secretary@rangeroverregister.org",
      city: "Cranleigh",
      postalCode: "GU6 8WP",
      countryCode: "GB",
      imageUrl: "/assets/images/range-rover-register.jpg",
      category: "Car Club",
      state: "Surrey",
      slug: "range-rover-register",
      featured: true,
      description: "The Range Rover Register is dedicated to the classic Range Rover, manufactured from 1970 to 1996.",
      marque: "Range Rover"
    }
  ];
  
  // Combine the original and curated clubs
  const allClubs = [...originalClubs, ...curatedClubs];
  
  // Create a map to track duplicate slugs and make them unique
  const slugMap = {};
  
  allClubs.forEach((club, index) => {
    // Create a base slug from the title
    let baseSlug = club.slug || club.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    
    // Check if this slug already exists in our map
    if (slugMap[baseSlug]) {
      // For duplicates, create a unique slug by adding location or other information
      if (club.city) {
        baseSlug = `${baseSlug}-${club.city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
      } else if (club.state) {
        baseSlug = `${baseSlug}-${club.state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
      } else if (club.marque) {
        baseSlug = `${baseSlug}-${club.marque.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
      }
      
      // If we still have a duplicate, add something unique
      if (slugMap[baseSlug]) {
        baseSlug = `${baseSlug}-club`;
      }
    }
    
    // Set the slug and mark it as used
    slugMap[baseSlug] = true;
    club.slug = baseSlug;
    
    // Also add an ID for reference (we'll keep this but won't use it in URLs)
    club.id = index + 1;
  });
  
  // Normalize categories to ensure consistency
  allClubs.forEach(club => {
    // First, normalize all the similar categories that should become 'Car Club'
    if (club.category === 'Car' || club.category === 'Club') {
      club.category = 'Car Club';
    }
    
    // Then convert 'Car Club' to 'Classic Car Club' as a second pass
    if (club.category === 'Car Club') {
      club.category = 'Classic Car Club';
    }
    
    // Other normalizations
    if (club.category === 'Motoring club') {
      club.category = 'Motor Club';
    }
    if (club.category === 'Historical Vehicle Club') {
      club.category = 'Historic Vehicle Club';
    }
  });

  return allClubs;
};
