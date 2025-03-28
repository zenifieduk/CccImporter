const origClubs = require('./clubs-orig.js');

// Add description field for each club
function enhanceClubData(club) {
  return {
    ...club,
    description: `${club.title} is a car club${club.city ? ` based in ${club.city}` : ''}.`,
    featured: ['Rolls-Royce', 'Bentley', 'Jaguar', 'Aston Martin', 'Ferrari', 'Porsche', 'Rover', 'Ford', 'Peugeot', 'Classic'].includes(club.marque) ? Math.random() < 0.1 : false
  };
}

module.exports = function() {
  // Enhance the club data with descriptions and featured flags
  const originalClubs = origClubs.map(enhanceClubData);
  
  // Add some manually curated clubs with images
  const curatedClubs = [
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
  return [...originalClubs, ...curatedClubs];
};
