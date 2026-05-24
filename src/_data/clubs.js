const origClubs = require('./clubs-orig.js');

// Add description field for each club
function enhanceClubData(club) {
  // Use existing description if provided, otherwise generate one
  const description = club.description || `${club.title} is a UK-based ${club.category}. If you're passionate about classic vehicles, this club is a great place to connect with fellow ${club.marque} enthusiasts${club.city ? ` in ${club.city}` : ''}.`;

  // Use existing featured flag if provided, otherwise default to false
  const featured = club.featured !== undefined ? club.featured : false;

  return {
    ...club,
    description: description,
    featured: featured
  };
}

module.exports = function() {
  // Enhance the club data with descriptions and featured flags
  const originalClubs = origClubs.map(enhanceClubData);
  
  // Add some manually curated clubs with images
  const curatedClubs = [
    // SHOWCASE CLUB PLACEHOLDER
    {
      title: "Bentley Drivers Club",
      website: "https://www.bdcl.org/",
      address: "W.O. Bentley Memorial Building, Ironstone Lane, Wroxton, Banbury, Oxfordshire, OX15 6ED, United Kingdom",
      phone: "01295 738886",
      email: "info@bdcl.org",
      city: "Banbury",
      postalCode: "OX15 6ED",
      countryCode: "GB",
      imageUrl: "/assets/images/showcase/bentley-drivers-club/bentley-drivers-club-hero.avif",
      category: "Car Club",
      state: "Oxfordshire",
      slug: "bentley-drivers-club",
      showcase: true,
      featured: false,
      lat: 52.0697,
      lng: -1.3800,
      eventsPageUrl: "https://www.bdcl.org/events/events/",
      clubEthos: `<p>Founded in 1936, the Bentley Drivers Club (BDC) is dedicated to preserving and celebrating the heritage of Bentley Motors. The club embodies W.O. Bentley's spirit of excellence, fostering a community where owners and enthusiasts can share their passion for these extraordinary vehicles.</p>

      <p>With a rich history spanning over 85 years, the BDC maintains close ties with Bentley Motors while remaining proudly independent. The club's ethos centers on promoting the appreciation and enjoyment of Bentley motorcars of all ages, from vintage to modern, through driving, social, and competitive events.</p>`,
      
      description: `<p>The <strong>Bentley Drivers Club</strong> is the premier international club for Bentley enthusiasts, offering an unparalleled experience for owners and admirers of these prestigious motorcars. Based at the W.O. Bentley Memorial Building in Oxfordshire, the club serves as a hub for Bentley heritage and contemporary appreciation.</p>
      <ul>
        <li>Exclusive events including track days, rallies, and concours</li>
        <li>Technical support and expertise for all Bentley models</li>
        <li>Award-winning quarterly magazine "Review"</li>
        <li>Access to unique Bentley archives and memorabilia</li>
        <li>Strong international presence with regional sections worldwide</li>
      </ul>
      <p>Join us to experience the excellence and camaraderie that defines the Bentley marque!</p>`,
      marque: "Bentley",
      membership: "Annual",
      facebook: "https://www.facebook.com/BentleyDriversClub",
      instagram: "https://www.instagram.com/bentleydrivers/",
      twitter: "https://twitter.com/bdcl1936",
      showcaseBanner: "/assets/images/showcase/bentley-drivers-club/bentley-drivers-club-hero.avif",
      showcaseLogo: "/assets/images/showcase/bentley-drivers-club/bentley-drivers-club-logo.avif",
      showcaseBadge: "/assets/images/clubs/showcase-badge.png",
      quickFacts: {
        members: "3500+",
        founded: "1936",
        notableMember: "W.O. Bentley (Honorary Life President)",
        location: "Wroxton, Oxfordshire"
      },
      aboutExpanded: `<h2>About the Bentley Drivers Club</h2>
      <p>The <strong>Bentley Drivers Club</strong>, established in 1936, is the world's premier organization for Bentley enthusiasts. From our headquarters at the W.O. Bentley Memorial Building in Wroxton, we serve a global community of members united by their passion for the Bentley marque.</p>

      <p>Our club offers:</p>
      <ul>
        <li>Regular track days at prestigious circuits</li>
        <li>Concours events and social gatherings</li>
        <li>Technical workshops and restoration advice</li>
        <li>Access to rare parts and specialist services</li>
        <li>Regional, national, and international events</li>
        <li>Quarterly magazine "Review" with in-depth features</li>
      </ul>

      <p>The club maintains strong ties with Bentley Motors while remaining independently run by and for its members. Whether you own a vintage Bentley or admire these remarkable vehicles, the BDC offers the perfect environment to share your enthusiasm.</p>

      <p>Ready to join? <a href="https://www.bdcl.org/join" target="_blank">Become a member today</a> and be part of Bentley's living heritage.</p>`,
      curatedEvents: [
        // Newly added from curated research:
  { title: "BDC Sprint 2025", date: "2025-04-26", location: "Mallory Park, Leicestershire", description: "Competitive sprint event showcasing Bentley performance on a historic track." },
  { title: "Aston Hillclimb Centenary Celebration", date: "2025-05-17", location: "Aston Hill, Aston Clinton", description: "Celebrating 100 years of historic hill climb racing with a special BDC gathering." },
  { title: "BDC Nominated Hill Climb", date: "2025-06-07", location: "Shelsley Walsh Hill Climb, Worcestershire", description: "Take on the famous Shelsley Walsh Hill Climb at this exciting BDC motorsport event." },
  { title: "East Midlands Chairman's Tour", date: "2025-06-27", location: "East Midlands", description: "Four-day scenic driving tour through the picturesque East Midlands countryside." },
  { title: "77th Summer Concours", date: "2025-06-28", location: "Walton Hall, Warwickshire", description: "A prestigious display of pristine Bentleys competing for Concours honours." },
  { title: "77th BDC Silverstone Race Day", date: "2025-08-09", location: "Silverstone Circuit", description: "Thrilling race day action at Silverstone, a highlight of the BDC motorsport calendar." },
  { title: "Summer Lunch Party", date: "2025-08-03", location: "North Bosent Farm, Cornwall", description: "Relaxed summer gathering with lunch set in the stunning Cornish countryside." }
],
      mediaGallery: [
        "/assets/images/showcase/bentley-drivers-club/gallery-1.avif",
        "/assets/images/showcase/bentley-drivers-club/gallery-5.avif",
        "/assets/images/showcase/bentley-drivers-club/gallery-3.avif",
        "/assets/images/showcase/bentley-drivers-club/gallery-4.avif",
        "/assets/images/showcase/bentley-drivers-club/gallery-2.avif"
      ],
      map: {
        hq: "W.O. Bentley Memorial Building, Wroxton, Oxfordshire",
        hqLat: 52.0697,
        hqLng: -1.3800,
        venues: [
          { name: "W.O. Bentley Memorial Building", lat: 52.0697, lng: -1.3800 }
        ]
      },
      ctas: [
        { label: "Join the Club", url: "https://www.bdcl.org/join" },
        { label: "Visit Club Website", url: "https://www.bdcl.org/" },
        { label: "Contact Us", url: "https://www.bdcl.org/contact" },
        { label: "Club Shop", url: "https://www.bdcl.org/shop" },
        { label: "Follow on Instagram", url: "https://www.instagram.com/bentleydriversclub/" },
        { label: "Join Facebook Group", url: "https://www.facebook.com/profile.php?id=100064534606230" }
      ],
      relatedShowcaseClubs: []
    },
    {
      title: "Spirit Motor Club",
      website: "https://spiritmotorclub.com/",
      address: "Newport, South Wales",
      phone: "",
      email: "hello@spiritmotorclub.com",
      city: "Newport",
      postalCode: "",
      countryCode: "GB",
      imageUrl: "/assets/images/showcase/spirit-club/spirit-club-hero.avif",
      category: "Car Club",
      state: "",
      slug: "spirit-motor-club",
      featured: true,
      showcase: true,
      lat: 51.5904969, 
      lng: -3.0564777,
      eventsPageUrl: "https://spiritmotorclub.com/events/",
      clubEthos: `<p>Founded by David and Owain in May 2024, Spirit Motor Club is rooted in the belief that motoring can do more than bring people together—it can support well-being and drive positive change. The club embraces inclusivity and aims to create an environment where everyone feels welcome, valued, and connected.</p>

      <p>Through its ethos of <em>'Fuelling Connection™'</em>, the club champions mental health awareness and regularly supports local charities via fundraising events and partnerships. It's a space where a shared love of cars goes hand-in-hand with community spirit and doing good.</p>`,
      
      description: `<p><strong>Spirit Motor Club</strong> is South Wales' premier community for automotive enthusiasts, uniting owners and fans of sports, classic, and performance cars. Founded in 2024, the club is dedicated to celebrating the passion, camaraderie, and thrill of motoring. Whether you drive a Porsche, a classic British icon, or simply love cars, Spirit Motor Club offers a welcoming environment for all.</p>
      <ul>
        <li>Regular meets and drives across scenic Welsh routes</li>
        <li>Exclusive access to track days, social events, and car shows</li>
        <li>Expert talks, technical workshops, and member-only resources</li>
        <li>Active online community and social media presence</li>
      </ul>
      <p>Join us to experience the spirit of motoring, make new friends, and share your automotive journey!</p>`,
      marque: "Porsche",
      membership: "Free",
      facebook: "https://www.facebook.com/spiritmotorclub/",
      instagram: "https://www.instagram.com/spiritmotorclub/",
      linkedin: "https://www.linkedin.com/company/spiritmotorclub/",
      showcaseBanner: "/assets/images/showcase/spirit-club/spirit-club-gallery-5.avif",
      showcaseLogo: "/assets/images/showcase/spirit-club/spirit-club-logo.avif",
      showcaseBadge: "/assets/images/clubs/showcase-badge.png",
      quickFacts: {
        members: "250+",
        founded: "2024",
        notableMember: '<a href="https://www.smallestcog.com/" target="_blank" rel="noopener noreferrer">Richard Hammond</a>',
        location: "South Wales"
      },
      aboutExpanded: `<h2>About Spirit Motor Club</h2>
      <p><strong>Spirit Motor Club</strong> is a South Wales-based motoring community created in 2024 for enthusiasts of sports, classic, and performance cars. Whether you're a Porsche owner, a casual admirer of fine automobiles, or someone who simply enjoys the energy of a car meet, the club offers a welcoming space to share that passion.</p>

<ul>
  <li>Relaxed, inclusive meets across scenic Welsh locations</li>
  <li>Family-friendly events, open to couples and well-behaved dogs</li>
  <li>Access to track days, drives, social gatherings, and community initiatives</li>
</ul>

<p>Spirit Motor Club is all about real connections, great conversations, and the enjoyment of motoring in good company.</p>


      <p>Ready to join? <a href="https://spiritmotorclub.com/" target="_blank">Become a member today</a> and be part of something special.</p>`,
      curatedEvents: [
        { title: "Porsche + Friends | Sports & Classic Cars Social", date: "2025-03-02", location: "Newport, South Wales", description: "A relaxed social gathering for Porsche and classic car enthusiasts. Open to all marques." }
      ],
      mediaGallery: [
        "/assets/images/showcase/spirit-club/spirit-club-gallery-1.avif",
        "/assets/images/showcase/spirit-club/spirit-club-gallery-2.avif",
        "/assets/images/showcase/spirit-club/spirit-club-gallery-3.avif",
        "/assets/images/showcase/spirit-club/spirit-club-gallery-4.avif",
        "/assets/images/showcase/spirit-club/spirit-club-gallery-5.avif"
      ],
      map: {
        hq: "Newport, South Wales",
        hqLat: 51.5904969, 
        hqLng: -3.0564777, 
        venues: [
          { name: "Tiny Rebel, Chartist Drive Rogerstone NP10 9FQ", lat: 51.5904969, lng: -3.0564777 }
        ]
      },
      ctas: [
        { label: "Membership", url: "https://spiritmotorclub.com/" },
        { label: "Visit Club Website", url: "https://spiritmotorclub.com/" },
        { label: "Contact", url: "https://spiritmotorclub.com/contact" },
        { label: "Merchandise", url: "https://spiritmotorclub.com/shop/" },
        { label: "Follow on Instagram", url: "https://www.instagram.com/spiritmotorclub/" },
        { label: "Join Facebook Group", url: "https://www.facebook.com/spiritmotorclub/" }
      ],
      relatedShowcaseClubs: []
    },
    {
      title: "North West Casual Classics",
      website: "https://northwestcasualclassics.com/",
      address: "Warrington, WA1 1AA",
      phone: "01925 123456",
      email: "info@northwestcasualclassics.com",
      city: "Warrington",
      postalCode: "WA1 1AA",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/northwest-casual-classics.avif",
      category: "Classic Vehicle Club",
      state: "Cheshire",
      slug: "north-west-casual-classics",
      featured: true,
      showcase: true,
      lat: 53.3875952, 
      lng: -2.6572889, 
      eventsPageUrl: "https://northwestcasualclassics.com/events/",
      description: "<p>North West Casual Classics was established in 1995 by a group of motor enthusiasts with a varied collection of vehicles. The club is known for its friendly, multi-vehicle and multi-make approach, welcoming members of all ages, including younger enthusiasts with modern classics. It has grown to become one of the North West's leading <a href='/club-directory/?category=Classic+Vehicle+Club#results-section'>classic vehicle clubs</a>, celebrated for its inclusive community and passion for preserving automotive heritage.</p><p>The club's Events Team organises a variety of activities throughout the year, from scenic runs and static displays to its flagship early June Annual Show and a later event in September at RAF Burtonwood. In addition, the club supports various charities chosen by its members at the December AGM. Based between Manchester and Liverpool, monthly meetings are held on the second Tuesday at 7:30pm at the Penketh and Sankey Conservative Club in WA5 2BG, inviting all those with a passion for classic vehicles to join in.</p>",
      marque: "Classic",
      membership: "£20",
      facebook: "https://www.facebook.com/groups/northwestcasualclassics/",
      ctas: [
        { label: "Visit Website", url: "https://northwestcasualclassics.com" },
        { label: "Contact", url: "https://northwestcasualclassics.com/#contact" },
        { label: "Follow on Facebook", url: "https://www.facebook.com/groups/northwestcasualclassics/" }
      ],
      quickFacts: {
        members: "250+",
        founded: "1995",
        location: "Warrington, Cheshire"
      },
      aboutExpanded: `<h2>About North West Casual Classics</h2>
      <p>North West Casual Classics was established in 1995 by a group of motor enthusiasts with a varied collection of vehicles. The club is known for its friendly, multi-vehicle and multi-make approach, welcoming members of all ages, including younger enthusiasts with modern classics. It has grown to become one of the North West's leading classic vehicle clubs, celebrated for its inclusive community and passion for preserving automotive heritage.</p>
      <p>The club's Events Team organises a variety of activities throughout the year, from scenic runs and static displays to its flagship early June Annual Show and a later event in September at RAF Burtonwood. In addition, the club supports various charities chosen by its members at the December AGM. Based between Manchester and Liverpool, monthly meetings are held on the second Tuesday at 7:30pm at the Penketh and Sankey Conservative Club in WA5 2BG, inviting all those with a passion for classic vehicles to join in.</p>
      <p>Ready to join? <a href="https://northwestcasualclassics.com" target="_blank">Become a member today</a> and be part of something special.</p>`,
    map: { 
      hq: "Warrington, Cheshire", 
      hqLat: 53.3875952, 
      hqLng: -2.6572889,  
      venues: [
        { name: "Penketh and Sankey Conservative Club in WA5 2BG", lat: 53.3875952, lng: -2.6572889 }
      ]
    } 
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
      category: "Military Vehicle Club",
      state: "Northamptonshire",
      slug: "the-military-vehicle-trust",
      featured: true,
      description: "<p>The Military Vehicle Trust (MVT) is the world's largest organisation of ex-military vehicle owners and enthusiasts, and the only UK charity dedicated to preserving historic military vehicles. Established in 1968, the Trust has supported the restoration and maintenance of thousands of military vehicles following their service in the armed forces. Its mission is to keep these 'mechanical veterans' alive, advancing public understanding of their role in military history through education, events, and community involvement.</p><p>The Northampton branch of the MVT welcomes individuals with an interest in military vehicles, whether or not they own one. Its growing membership includes vehicle owners, re-enactors, living historians and general enthusiasts who all share a commitment to preserving military heritage. The branch supports a wide range of activities throughout the year and contributes to both local and national historic vehicle events.</p>",
      marque: "Military",
      membership: "From £35",
      facebook: "https://www.facebook.com/militaryvehicletrust",
      lat: 52.2398607,
      lng: -0.9629694,
    }
    ,
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
      marque: "Hot Rod",
      membership: "£28",
      lat: 51.8895421,
      lng: 0.8849868,
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
      imageUrl: "/assets/images/clubs/standard-motor-club.avif",
      category: "Car Club",
      state: "Somerset",
      slug: "standard-motor-club",
      featured: true,
      description: "<p>The Standard Motor Club caters to every model of Standard, including every coachbuilt body on a Standard chassis and any vehicle constructed from Standard parts. It welcomes owners from around the globe and operates as a non-profit organisation, managed by a democratically elected committee at its annual general meeting. The club prides itself on transparency by publishing detailed annual accounts, while its website— <a href='https://www.standardmotorclub.org' rel='noopener'>www.standardmotorclub.org</a>—houses thousands of pages, photographs, and features that continue to expand through ongoing contributions.</p><p>Membership of the club offers access to a comprehensive range of services, including a monthly magazine, a spare parts and remanufacturing service, and expert technical, repair, and restoration advice. In addition, members benefit from a regalia service, as well as national and international groups, events, and meetings, all designed to support Standard vehicle enthusiasts. Prospective members are encouraged to join and help preserve this most famous marque, with all services available worldwide.</p><p><strong>Over 1,000 members in 28 countries!</strong></p>",
      marque: "Standard",
      membership: "From £33",
      facebook: "https://www.facebook.com/groups/STANDARDMOTORCLUBGROUP/",
      lat: 51.378877,
      lng: -2.3581388,
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
      imageUrl: "/assets/images/clubs/strathmore-vintage-vehicle-club.avif",
      category: "Car Club",
      state: "Angus",
      slug: "strathmore-vintage-vehicle-club",
      featured: true,
      description: "The Strathmore Vintage Vehicle Club is dedicated to the preservation and restoration of vintage vehicles of all types.",
      marque: "Various",
      lat: 56.633854,
      lng: -2.9175402,
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
      marque: "Classic",
      lat: 52.8894858,
      lng: -4.4212739,
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
      imageUrl: "/assets/images/clubs/alvis-owners-club.avif",
      category: "Car Club",
      state: "Staffordshire",
      slug: "alvis-owners-club",
      featured: true,
      description: "The Alvis Owner Club was founded in 1951 to encourage the preservation and continued use of all Alvis cars.",
      marque: "Alvis",
      lat: 52.6806057,
      lng: -1.8471142,
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
      imageUrl: "/assets/images/clubs/rolls-royce-enthusiasts.avif",
      category: "Car Club",
      state: "Northamptonshire",
      slug: "rolls-royce-enthusiasts-club",
      featured: true,
      description: "The Rolls-Royce Enthusiasts' Club is a worldwide organisation dedicated to the preservation and promotion of Rolls-Royce and Bentley motor cars.",
      marque: "Rolls-Royce",
      lat: 52.1036608,
      lng: -0.9520769,
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
      marque: "Classic",
      lat: 51.5251884,
      lng: -0.1025577,
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
      imageUrl: "/assets/images/clubs/rolls-royce-enthusiasts-wessex.jpg",
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
      imageUrl: "/assets/images/clubs/rover-p4-club.jpg",
      category: "Car Club",
      state: "",
      slug: "rover-p4-drivers-guild",
      description: "The Rover P4 Drivers Guild caters for owners and enthusiasts of the Rover P4 models manufactured between 1949 and 1964.",
      marque: "Rover",
      lat: 52.0595486,
      lng: -0.8688086,
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
      imageUrl: "/assets/images/clubs/rover-sdi-club.avif",
      category: "Car Club",
      state: "",
      slug: "rover-sdi-club",
      description: "The Rover SDI Club is dedicated to the preservation and enjoyment of the Rover SD1 range of cars manufactured from 1976 to 1986.",
      marque: "Rover",
      lat: 51.5658263,
      lng: -1.7973883,
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
      imageUrl: "/assets/images/clubs/club-peugeot.avif",
      category: "Car Club",
      state: "North Yorkshire",
      slug: "club-peugeot-uk",
      featured: true,
      description: "Club Peugeot UK is the official club for all Peugeot enthusiasts, covering all models from vintage to modern.",
      marque: "Peugeot",
      lat: 54.0124477,
      lng: -1.0710661,
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
      imageUrl: "/assets/images/clubs/ford-classic-capri.avif",
      category: "Car Club",
      state: "Essex",
      slug: "ford-classic-and-capri-owners-club",
      featured: false,
      description: "The Ford Classic and Capri Owners Club caters for the Ford Consul Classic, Consul Capri and all models of Ford Capri.",
      marque: "Ford"
    },
    {
      title: "Fiat 500 Enthusiasts Club",
      featured: true,
      description: "<p>Fiat 500 Enthusiasts is a friendly UK club dedicated to the classic Fiat 500 and its many charming derivatives, including the Topolino, Gamine, Jolly, Giardiniera, Abarth, 126 and 600 — all produced from the 1930s to the 1970s. The club was formed to bring together owners, their families, and passionate supporters of these iconic Italian models. Run as a not-for-profit by its members, it offers advice, support, and a growing archive of technical resources including original paint codes and wiring diagrams.</p> <p>It is affiliated with Fiat 500 Club Italia and is a member of the <a href='https://www.fbhvc.co.uk/' target='_blank' rel='noopener noreferrer'>Federation of British Historic Vehicle Clubs</a>, supporting the rights of classic car owners across the UK.</p>",
      website: "https://www.fiat500enthusiasts.co.uk",
      address: "24 Crown Crescent, London, SW18 3JB",
      phone: "01483 715656",
      email: "membership@fiat500enthusiasts.co.uk",
      city: "London",
      postalCode: "SW18 3JB",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/fiat-500-enthusiasts-club-london.avif",
      category: "Car Club",
      state: "Greater London",
      slug: "fiat-500-enthusiasts-club",
      membership: "£25",
      facebook: "https://www.facebook.com/groups/1114646726713440",
      lat: 51.4486308,
      lng: -0.1812111,
    },
    {
      title: "Classic Car Club London",
      website: "https://www.facebook.com/ClassicCarClubLondon",
      address: "The Brewery Building, 16 Brewhouse Yard, London, EC1V 4LJ",
      phone: "020 7490 9090",
      email: "info@classiccarclublondon.co.uk",
      city: "London",
      postalCode: "EC1V 4LJ",
      countryCode: "GB",
      imageUrl: "/assets/images/clubs/classic-car-club-london.avif",
      category: "Car Club",
      state: "Greater London",
      slug: "classic-car-club-london",
      featured: true,
      description: "Classic Car Club London offers membership-based access to a fleet of iconic classic and performance cars in the heart of London.",
      marque: "Classic",
      lat: 51.5240336,
      lng: -0.1037639,
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
      imageUrl: "/assets/images/clubs/range-rover-register.avif",
      category: "Car Club",
      state: "Surrey",
      slug: "range-rover-register",
      featured: true,
      description: "The Range Rover Register is dedicated to the classic Range Rover, manufactured from 1970 to 1996.",
      marque: "Range Rover",
      lat: 51.1373671,
      lng: -0.5041736,
    }
  ];
  
  // Combine the original and curated clubs, curated last to give them priority
  const combinedClubs = [...originalClubs, ...curatedClubs];

  // De-duplicate clubs, prioritizing the curated ones (which appear later in the combined list)
  const uniqueClubsMap = new Map();
  combinedClubs.forEach(club => {
    // Use slug as the primary key for uniqueness
    uniqueClubsMap.set(club.slug, club);
  });
  const allClubs = Array.from(uniqueClubsMap.values());
  
  // Create a map to track duplicate slugs and make them unique
  const slugMap = {};
  
  allClubs.forEach((club, index) => {
    // Use the pre-defined slug if it exists (from curatedClubs), otherwise generate one
    let originalSlug = club.slug; // Store the curated slug if it exists
    let baseSlug = originalSlug || club.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    let finalSlug = baseSlug;
    let counter = 1;

    // Special handling for showcase clubs - always use their original slug without modifications
    if (club.showcase) {
      slugMap[baseSlug] = true;
      club.slug = baseSlug;
      // Also add an ID for reference (we'll keep this but won't use it in URLs)
      club.id = index + 1;
      return; // Skip the rest of the loop for showcase clubs
    }

    // If the slug already exists AND it wasn't a pre-defined one, try appending city, then state, then a counter
    // We check slugMap[finalSlug] first to avoid unnecessary modifications
    while (slugMap[finalSlug] && (!originalSlug || finalSlug !== originalSlug)) { 
        if (counter === 1 && club.city) {
            finalSlug = `${baseSlug}-${club.city.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
        } else if (counter === 2 && club.state) {
            finalSlug = `${baseSlug}-${club.state.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
        } else {
            // Use a counter as a fallback to guarantee uniqueness
            finalSlug = `${baseSlug}-${counter}`;
        }
        // If the new attempt also exists, increment counter and try again
        if (slugMap[finalSlug]) { 
          counter++;
        } else {
          // If the new slug is unique, break the loop
          break; 
        }
        // Safety break to prevent infinite loops in edge cases
        if (counter > 10) { 
          console.warn(`Could not generate unique slug for: ${club.title}, using ${finalSlug}`);
          break; 
        }
    }

    // Set the final unique slug and mark it as used
    slugMap[finalSlug] = true;
    club.slug = finalSlug; // Assign the potentially modified slug

    // Also add an ID for reference (we'll keep this but won't use it in URLs)
    club.id = index + 1; // This ID should NOT be part of the slug/URL
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
