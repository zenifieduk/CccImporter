module.exports = function () {
  // Helper function to parse auctionStartDateTime
  function parseAuctionDate(dateStr) {
    if (!dateStr) return null;
    // DDMMYYYY:HH:MM:SS
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4); // Month is 0-indexed in JS Date constructor if using YYYY,MM,DD
    const year = dateStr.substring(4, 8);
    const time = dateStr.substring(9); // HH:MM:SS
    // Ensure consistent date string format for Date constructor (YYYY-MM-DDTHH:MM:SS)
    return new Date(`${year}-${month}-${day}T${time}`);
  }

  // Filter function to remove past auctions
  function filterUpcomingAuctions(auctionsList) {
    const now = new Date();
    return auctionsList.filter(auction => {
      const auctionDate = parseAuctionDate(auction.auctionStartDateTime);
      return auctionDate && auctionDate >= now;
    }).sort((a, b) => {
      // Sort by date ascending (earliest first)
      const dateA = parseAuctionDate(a.auctionStartDateTime);
      const dateB = parseAuctionDate(b.auctionStartDateTime);
      return dateA - dateB;
    });
  }

  // TODO: Future integration options
  // 1. Fetch from CMS API (Strapi, Contentful, etc.)
  // 2. Web scraping from auction house websites
  // 3. RSS/JSON feeds from auction houses
  // 4. Manual CSV/JSON file updates
  // 
  // Example CMS integration:
  // const fetchAuctionsFromCMS = async () => {
  //   try {
  //     const response = await fetch('https://your-cms.com/api/auctions?status=upcoming');
  //     const cmsAuctions = await response.json();
  //     return cmsAuctions.map(auction => ({
  //       // Transform CMS data to your format
  //     }));
  //   } catch (error) {
  //     console.log('Failed to fetch from CMS, using static data');
  //     return [];
  //   }
  // };

  // This would typically be fetched from a headless CMS
  // For now, using static data based on the provided sample
  const auctions = [
    // ============ ANGLIA CAR AUCTIONS ============
    {
      auctionTitle: "June 2025 Classic Car Auction",
      auctionStartDateTime: "14062025:09:00:00",
      auctionWebsite: "https://angliacarauctions.co.uk/auctions/2706-14-Jun-2025",
      auctionAddress: "The Cattle Market, Beveridge Way, King's Lynn, Norfolk",
      auctionLat: 52.733709,
      auctionLng: 0.411435,
      auctionPhone: "01553 771881",
      auctionCity: "King's Lynn",
      auctionPostalCode: "PE30 4NB",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/anglia-car-auctions-june-2025.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Norfolk",
      auctionSlug: "june-2025-classic-car-auction",
      auctionFeatured: false,
      auctionHighlights: "Classic Cars, Motorcycles and Automobilia",
      auctionHighlightsHtml: "Classic Car Auction featuring a wide range of vehicles<br>Automobilia from 10am Saturday<br>Motorcycles from 10am Sunday<br>Two-day auction event",
      auctionHouse: "Anglia Car Auctions"
    },

    // ============ BRIGHTWELLS ============
    {
      auctionTitle: "25th June 2025 Classic Cars & Motorcycles",
      auctionStartDateTime: "25062025:10:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-june-2025-classic-cars.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-june-2025-classic-cars-motorcycles",
      auctionFeatured: false,
      auctionHighlights: "Classic Cars and Motorcycles Auction",
      auctionHighlightsHtml: "Timed online auction of classic cars and motorcycles<br>Viewing available Monday-Tuesday before auction<br>12% buyer's premium + VAT",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "25th June 2025 Modern Classics",
      auctionStartDateTime: "25062025:14:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-june-2025-modern-classics.avif",
      auctionCategory: "Modern Classics Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-june-2025-modern-classics",
      auctionFeatured: false,
      auctionHighlights: "Modern Classic Car Auction",
      auctionHighlightsHtml: "Timed online auction featuring modern classics<br>Bidding starts Saturday before auction<br>Viewing Monday-Tuesday prior to auction",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "6th August 2025 Classic Cars & Motorcycles",
      auctionStartDateTime: "06082025:10:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-august-2025-classic-cars.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-august-2025-classic-cars-motorcycles",
      auctionFeatured: false,
      auctionHighlights: "Classic Cars and Motorcycles Auction",
      auctionHighlightsHtml: "Timed online auction of classic cars and motorcycles<br>Vehicles physically present at Easters Court premises<br>Extensive vehicle inspection and paperwork verification",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "6th August 2025 Modern Classics",
      auctionStartDateTime: "06082025:10:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-august-2025-modern-classics.avif",
      auctionCategory: "Modern Classics Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-august-2025-modern-classics",
      auctionFeatured: false,
      auctionHighlights: "Modern Classic Car Auction",
      auctionHighlightsHtml: "Timed online auction specialising in modern classics.<br> Online bidding format with extensive preparation time",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "17th September 2025 Classic Cars & Motorcycles",
      auctionStartDateTime: "17092025:10:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-september-2025-classic-cars.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-september-2025-classic-cars-motorcycles",
      auctionFeatured: false,
      auctionHighlights: "Classic Cars and Motorcycles Auction",
      auctionHighlightsHtml: "Timed online auction of classic cars and motorcycles<br>Viewing available Monday-Tuesday before auction<br>12% buyer's premium + VAT",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "29th October 2025 Classic Cars & Motorcycles",
      auctionStartDateTime: "29102025:10:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-october-2025-classic-cars.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-october-2025-classic-cars-motorcycles",
      auctionFeatured: false,
      auctionHighlights: "Classic Cars and Motorcycles Auction",
      auctionHighlightsHtml: "Timed online auction of classic cars and motorcycles<br>Viewing available Monday-Tuesday before auction<br>12% buyer's premium + VAT",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "29th October 2025 Modern Classics",
      auctionStartDateTime: "29102025:14:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-october-2025-modern-classics.avif",
      auctionCategory: "Modern Classics Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-october-2025-modern-classics",
      auctionFeatured: false,
      auctionHighlights: "Modern Classic Car Auction",
      auctionHighlightsHtml: "Timed online auction specialising in modern classics. <br>Online bidding format with extensive preparation time",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "10th December 2025 Classic Cars & Motorcycles",
      auctionStartDateTime: "10122025:10:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-december-2025-classic-cars.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-december-2025-classic-cars-motorcycles",
      auctionFeatured: false,
      auctionHighlights: "Classic Cars and Motorcycles Auction",
      auctionHighlightsHtml: "Timed online auction of classic cars and motorcycles<br>Viewing available Monday-Tuesday before auction<br>12% buyer's premium + VAT",
      auctionHouse: "Brightwells"
    },
    {
      auctionTitle: "10th December 2025 Modern Classics",
      auctionStartDateTime: "10122025:14:00:00",
      auctionWebsite: "https://www.brightwells.com/classic-motoring/catalogue-not-available/",
      auctionAddress: "Easters Court, Mill Street, Leominster",
      auctionLat: 52.2316809,
      auctionLng: -2.7332604,
      auctionPhone: "01568 611122",
      auctionCity: "Leominster",
      auctionPostalCode: "HR6 0DE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/brightwells-december-2025-modern-classics.avif",
      auctionCategory: "Modern Classics Auctions",
      auctionState: "Herefordshire",
      auctionSlug: "brightwells-december-2025-modern-classics",
      auctionFeatured: false,
      auctionHighlights: "Modern Classic Car Auction",
      auctionHighlightsHtml: "Timed online auction specializing in modern classics<br>£2,500 registration deposit required to participate<br>Online bidding format with extensive preparation time",
      auctionHouse: "Brightwells"
    },

    // ============ CAR & CLASSIC AUCTIONS ============
    // No auctions listed for Car & Classic Auctions in your data

    // ============ CHARTERHOUSE ============
    // No auctions listed for Charterhouse in your data

    {
      auctionTitle: "Classic & Vintage Car Auction",
      auctionStartDateTime: "26062025:11:00:00",
      auctionWebsite: "https://charterhouse-cars.com/next-car-auction",
      auctionAddress: "Haynes International Motor Museum, Sparkford",
      auctionLat: 51.0408941,
      auctionLng: -2.5602764,
      auctionPhone: "01935 812277",
      auctionCity: "Yeovil",
      auctionPostalCode: "BA22 7LH",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/charterhouse-june-2025-classic-car-auction.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Somerset",
      auctionSlug: "charterhouse-june-2025-classic-vintage-car-auction",
      auctionFeatured: false,
      auctionHighlights: "Sir Malcolm Campbell's 1946 Armstrong Siddeley Hurricane",
      auctionHighlightsHtml: "Sir Malcolm Campbell's 1946 Armstrong Siddeley Hurricane<br>Painted in Campbell's special 'Blue Bird' colour<br>Estimated to sell for £10,000-£15,000",
      auctionHouse: "Charterhouse"
    },

    

    // ============ DORE & REES ============
{
  auctionTitle: "Thruxton Retro Competition and Fast Road Cars, and Motorcycles",
  auctionStartDateTime: "21062025:11:00:00",
  auctionWebsite: "https://www.doreandrees.com/motoring",
  auctionAddress: "Thruxton Circuit, Andover",
  auctionLat: 51.2060635,
  auctionLng: -1.6114635,
  auctionPhone: "07920 500091",
  auctionCity: "Andover",
  auctionPostalCode: "SP11 8PN",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/dore-rees-thruxton-june-2025.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "Hampshire",
  auctionSlug: "dore-rees-thruxton-retro-competition-cars-june-2025",
  auctionFeatured: false,
  auctionHighlights: "Competition and Fast Road Cars, and Motorcycles Auction",
  auctionHighlightsHtml: "Competition and Fast Road Cars, and Motorcycles<br>Held at Thruxton Circuit - the UK's fastest race circuit<br>Part of the Thruxton Retro racing festival",
  auctionHouse: "Dore & Rees"
},
{
  auctionTitle: "Castle Combe Autumn Classic",
  auctionStartDateTime: "21092025:11:00:00",
  auctionWebsite: "https://www.doreandrees.com/motoring",
  auctionAddress: "Castle Combe Circuit, Castle Combe, Chippenham",
  auctionLat: 51.4937077,
  auctionLng: -2.2169342,
  auctionPhone: "07920 500091",
  auctionCity: "Chippenham",
  auctionPostalCode: "SN14 7EY",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/dore-rees-castle-combe-september-2025.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "Wiltshire",
  auctionSlug: "dore-rees-castle-combe-autumn-classic-september-2025",
  auctionFeatured: false,
  auctionHighlights: "Collector's Cars Auction at Castle Combe Autumn Classic",
  auctionHighlightsHtml: "Classic and collector's car auction<br>Held at the historic Castle Combe Circuit<br>Part of the Castle Combe Autumn Classic event",
  auctionHouse: "Dore & Rees"
},


    





    // ============ DVCA ============
    // No auctions listed for DVCA in your data

    // ============ EWBANK'S ============
    {
      auctionTitle: "Summer Classic & Modern Cars & Automobilia",
      auctionStartDateTime: "04072025:10:00:00",
      auctionWebsite: "https://www.ewbankauctions.co.uk/Classic-Modern-Cars-Automobilia/2025-07-04",
      auctionAddress: "Burnt Common Auction Rooms, London Road, Send, Woking, Surrey, GU23 7LN, UK",
      auctionLat: 51.2776867,
      auctionLng: -0.5225828,
      auctionPhone: "01483 223101",
      auctionCity: "Woking",
      auctionPostalCode: "GU23 7LN",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/ewbank-auctions-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Surrey",
      auctionSlug: "classic-modern-cars-automobilia-july-2025",
      auctionFeatured: false,
      auctionHighlights: "Classic and modern cars, vintage car mascots, automobilia including toy models, period prints, signs, petroliana, brochures and parts",
      auctionHighlightsHtml: "Surrey's premier classic car auction featuring vehicles from brands including Bentley, Ferrari, Alfa Romeo, Mercedes-Benz, McLaren, Jaguar, Austin Healey, and Rolls Royce.",
      auctionHouse: "Ewbank's"
    },

    {
      auctionTitle: "Autumn Cars, Motorbikes & Automobilia",
      auctionStartDateTime: "03102025:10:00:00",
      auctionWebsite: "https://www.ewbankauctions.co.uk/Classic-Modern-Cars-Automobilia/2025-07-04",
      auctionAddress: "Burnt Common Auction Rooms, London Road, Send, Woking, Surrey, GU23 7LN, UK",
      auctionLat: 51.2776867,
      auctionLng: -0.5225828,
      auctionPhone: "01483 223101",
      auctionCity: "Woking",
      auctionPostalCode: "GU23 7LN",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/ewbank-auctions-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Surrey",
      auctionSlug: "ewbanks-classic-modern-cars-automobilia-october-2025",
      auctionFeatured: false,
      auctionHighlights: "Classic and modern cars, vintage car mascots, automobilia including toy models, period prints, signs, petroliana, brochures and parts",
      auctionHighlightsHtml: "Surrey's premier classic car auction featuring vehicles from brands including Bentley, Ferrari, Alfa Romeo, Mercedes-Benz, McLaren, Jaguar, Austin Healey, and Rolls Royce.",
      auctionHouse: "Ewbank's"
    },

    // ============ H&H CLASSICS ============
    {
      auctionTitle: "Pavilion Gardens Buxton Classic Motors Auction",
      auctionStartDateTime: "21052025:12:00:00",
      auctionWebsite: "https://www.handh.co.uk/auction-calendar/",
      auctionAddress: "St John's Rd, Buxton, SK17 6BE, UK",
      auctionLat: 53.2617,
      auctionLng: -1.9126,
      auctionPhone: "+44 (0) 1925 210035",
      auctionCity: "Buxton",
      auctionPostalCode: "SK17 6BE",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/handh/pavilion-gardens-buxton-classic-motors-auction-may-2025.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Derbyshire",
      auctionSlug: "pavilion-gardens-buxton-classic-motors-auction-may-2025",
      auctionFeatured: false,
      auctionHighlights: "Beautiful Pavilion Gardens setting - 137 lots of classic, collector and performance motorcars",
      auctionHighlightsHtml: "1953 Bentley R-Type 'Le Mans' Style Open Tourer by Paul Forty <br> 1960 Maserati 3500 GT <br> 1950 Healey Silverstone D-Type <br> +134 more...",
      auctionHouse: "H&H Classics"
    },
    {
      auctionTitle: "Millbrook Proving Ground Classic Motors Auction",
      auctionStartDateTime: "25062025:12:00:00",
      auctionWebsite: "https://www.handh.co.uk/auction-calendar/",
      auctionAddress: "Station Lane, Bedford, MK45 2JQ, UK",
      auctionLat: 52.0678,
      auctionLng: -0.5568,
      auctionPhone: "+44 (0) 1925 210035",
      auctionCity: "Milton Keynes",
      auctionPostalCode: "MK45 2JQ",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/handh/millbrook-proving-ground-classic-motors-auction-june-2025.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Buckinghamshire",
      auctionSlug: "millbrook-proving-ground-classic-motors-auction-june-2025",
      auctionFeatured: false,
      auctionHighlights: "1957 Bentley S1 Continental HJ Mulliner Fastback / 1971 Aston Martin DBS V8 / 1964 Rolls-Royce Silver Cloud III Drophead Coupe",
      auctionHighlightsHtml: "1957 Bentley S1 Continental HJ Mulliner Fastback<br>1971 Aston Martin DBS V8<br>1964 Rolls-Royce Silver Cloud III Drophead Coupe",
      auctionHouse: "H&H Classics"
    },

    // ============ HAMPSON MARKPLACE ============
    {
      auctionTitle: "The Gold Cup 2025 Classic, Performance & Supercar Auction",
      auctionStartDateTime: "27072025:12:00:00",
      auctionWebsite: "https://auctions.hampsonauctions.com/auction/details/-the-gold-cup-2025-classic-performance--supercar-auction/?au=31",
      auctionAddress: "Oulton Park Circuit, Little Budworth, Tarporley, Cheshire, CW6 9BW, UK",
      auctionLat: 53.1770869,
      auctionLng: -2.6223099,
      auctionPhone: "01606 828124",
      auctionCity: "Tarporley",
      auctionPostalCode: "CW6 9BW",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/hampson-marketplace-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "gold-cup-2025-classic-performance-supercar-auction",
      auctionFeatured: false,
      auctionHighlights: "Live auction at the prestigious Oulton Park Gold Cup Weekend featuring classic cars, performance vehicles, supercars, motorcycles, registrations and automobilia",
      auctionHighlightsHtml: "Live auction at the prestigious Oulton Park Gold Cup Weekend featuring classic cars, performance vehicles, supercars, motorcycles, registrations and automobilia. <br>Viewing: <br>Friday 25th July 9am-6pm, <br>Saturday 26th July 12noon-6pm, <br>Sunday 27th July 9am-12noon. <br>Auction charges among the lowest in the industry.",
      auctionHouse: "Hampson Marketplace"
    },

    {
      auctionTitle: "The Bolesworth Castle September 2025 Classic, Performance & Supercar Auction",
      auctionStartDateTime: "28092025:12:00:00",
      auctionWebsite: "https://auctions.hampsonauctions.com/auction/details/-the-bolesworth-castle-september-2025-classic-performance--supercar-auction/?au=32",
      auctionAddress: "Bolesworth Castle, Tattenhall, Chester, Cheshire, CH3 9HQ, UK",
      auctionLat: 53.1337194,
      auctionLng: -2.9666355,
      auctionPhone: "01606 828124",
      auctionCity: "Chester",
      auctionPostalCode: "CH3 9HQ",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/hampson-marketplace-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "bolesworth-castle-september-2025-classic-performance-supercar-auction",
      auctionFeatured: false,
      auctionHighlights: "Auction at the stunning Grade II* listed Bolesworth Castle featuring classic and collector cars, supercars, competition cars, motorcycles and automobilia",
      auctionHighlightsHtml: "Live auction at the magnificent Bolesworth Castle, a Grade II* listed country house set in 6,000 acres of beautiful Cheshire countryside. <br>Viewing: <br>Saturday 27th September 12noon-6pm, <br>Sunday 28th September 9am-12noon. <br>Buyer's Premium: Motor Cars 12.5% + VAT (min £250 + VAT), Registration Numbers 15% + VAT, Automobilia 15% + VAT.",
      auctionHouse: "Hampson Marketplace"
    },

    // ============ HISTORICS ============
    // No auctions listed for Historics in your data

    // ============ HUMBERT & ELLIS ============
    // No auctions listed for Humbert & Ellis in your data

   // ============ ICONIC AUCTIONEERS ============
{
  auctionTitle: "The Classic Sale at Wheeler Dealer Live 2025",
  auctionStartDateTime: "01062025:11:00:00",
  auctionWebsite: "https://www.iconicauctioneers.com/auction/upcoming-auctions-cars",
  auctionAddress: "Bicester Motion",
  auctionLat: 51.9160,
  auctionLng: -1.1409,
  auctionPhone: "01926 691141",
  auctionCity: "Bicester",
  auctionPostalCode: "OX26 5HA",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/iconic-auctioneers-wheeler-dealer-june-2025.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "Oxfordshire",
  auctionSlug: "iconic-auctioneers-wheeler-dealer-live-june-2025",
  auctionFeatured: false,
  auctionHighlights: "148 Entries of Classic and Vintage Cars",
  auctionHighlightsHtml: "148 Classic and Vintage Car Entries<br>Live auction with in-person and online bidding<br>Viewing available Saturday 31st May",
  auctionHouse: "Iconic Auctioneers"
},
{
  auctionTitle: "The Silverstone Classic Sale - Day 1",
  auctionStartDateTime: "23082025:11:00:00",
  auctionWebsite: "https://www.iconicauctioneers.com/auction/upcoming-auctions-cars",
  auctionAddress: "The Wing, Silverstone Circuit",
  auctionLat: 52.0786,
  auctionLng: -1.0147,
  auctionPhone: "01926 691141",
  auctionCity: "Silverstone",
  auctionPostalCode: "NN12 8TN",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/iconic-auctioneers-silverstone-august-2025-day1.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "Northamptonshire",
  auctionSlug: "iconic-auctioneers-silverstone-classic-august-2025-day1",
  auctionFeatured: false,
  auctionHighlights: "Classic Car Auction at the Historic Silverstone Circuit",
  auctionHighlightsHtml: "Premier classic car auction at Silverstone Circuit<br>Held at The Wing building<br>In-person and online bidding available",
  auctionHouse: "Iconic Auctioneers"
},
{
  auctionTitle: "The Silverstone Classic Sale - Day 2",
  auctionStartDateTime: "24082025:11:00:00",
  auctionWebsite: "https://www.iconicauctioneers.com/auction/upcoming-auctions-cars",
  auctionAddress: "The Wing, Silverstone Circuit",
  auctionLat: 52.0786,
  auctionLng: -1.0147,
  auctionPhone: "01926 691141",
  auctionCity: "Silverstone",
  auctionPostalCode: "NN12 8TN",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/iconic-auctioneers-silverstone-august-2025-day2.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "Northamptonshire",
  auctionSlug: "iconic-auctioneers-silverstone-classic-august-2025-day2",
  auctionFeatured: false,
  auctionHighlights: "Day 2 of the Prestigious Silverstone Classic Car Auction",
  auctionHighlightsHtml: "Second day of the premier classic car auction<br>Held at The Wing building at Silverstone Circuit<br>Multiple bidding options including in-person, phone, and online",
  auctionHouse: "Iconic Auctioneers"
},
{
  auctionTitle: "The NEC Classic Motor Show Sale",
  auctionStartDateTime: "07112025:11:00:00",
  auctionWebsite: "https://www.iconicauctioneers.com/auction/upcoming-auctions-cars",
  auctionAddress: "NEC, Birmingham",
  auctionLat: 52.4510,
  auctionLng: -1.7235,
  auctionPhone: "01926 691141",
  auctionCity: "Birmingham",
  auctionPostalCode: "B40 1NT",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/iconic-auctioneers-nec-november-2025.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "West Midlands",
  auctionSlug: "iconic-auctioneers-nec-classic-motor-show-november-2025",
  auctionFeatured: false,
  auctionHighlights: "Classic Car Auction at the UK's Biggest Classic Motor Show",
  auctionHighlightsHtml: "One of Iconic Auctioneers' biggest annual classic car auctions<br>Part of the NEC Classic Motor Show<br>Wide range of prestigious classic and collector vehicles",
  auctionHouse: "Iconic Auctioneers"
},
{
  auctionTitle: "The NEC Classic Motor Show Sale - Day 2",
  auctionStartDateTime: "08112025:11:00:00",
  auctionWebsite: "https://www.iconicauctioneers.com/auction/upcoming-auctions-cars",
  auctionAddress: "NEC, Birmingham",
  auctionLat: 52.4510,
  auctionLng: -1.7235,
  auctionPhone: "01926 691141",
  auctionCity: "Birmingham",
  auctionPostalCode: "B40 1NT",
  auctionCountryCode: "GB",
  auctionImageUrl: "/assets/images/auctions/iconic-auctioneers-nec-november-2025-day2.avif",
  auctionCategory: "Classic Car Auctions",
  auctionState: "West Midlands",
  auctionSlug: "iconic-auctioneers-nec-classic-motor-show-november-2025-day2",
  auctionFeatured: false,
  auctionHighlights: "Day 2 of the NEC Classic Motor Show Auction",
  auctionHighlightsHtml: "Second day of the premier NEC Classic Motor Show auction<br>Access with £20 auction catalogue (admits two)<br>Additional classic cars and automobilia",
  auctionHouse: "Iconic Auctioneers"
},

    // ============ MANOR PARK CLASSICS ============
    {
      auctionTitle: "May 2025 Motorcycle Auction",
      auctionStartDateTime: "23052025:11:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Ikon House, Tudor Road, Runcorn, Cheshire, WA7 1TA, UK",
      auctionLat: 53.3447861,
      auctionLng: -2.6787376,
      auctionPhone: "01925 210035",
      auctionCity: "Runcorn",
      auctionPostalCode: "WA7 1TA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/manor-park-may-2025-motorcycle-auction.avif",
      auctionCategory: "Classic Motorcycle Auctions",
      auctionState: "Cheshire",
      auctionSlug: "may-2025-motorcycle-auction",
      auctionFeatured: false,
      auctionHighlights: "1990 Ducati 900 SS - Estimate: £8,500 - £9,500",
      auctionHighlightsHtml: "1990 Ducati 900 SS <br> 1984 Yamaha RZV500R <br> 1956 BSA DBD34 Gold Star <br> +61 More...",
      auctionHouse: "Manor Park Classics"
    },
    {
      auctionTitle: "May 2025 Classic Car Auction",
      auctionStartDateTime: "24052025:11:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Ikon House, Tudor Road, Runcorn, Cheshire, WA7 1TA, UK",
      auctionLat: 53.3447861,
      auctionLng: -2.6787376,
      auctionPhone: "01925 210035",
      auctionCity: "Runcorn",
      auctionPostalCode: "WA7 1TA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/manor-park-may-2025-classic-car-auction.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "may-2025-classic-car-auction",
      auctionFeatured: false,
      auctionHighlights: "2003 Land Rover Discovery 4.0i V8 ES - Estimate: £13,000 - £15,000",
      auctionHighlightsHtml: "1965 Jaguar E-Type 4.2 Coupe <br> 2009 Ferrari F430 F1 <br> 1936 Bentley 4.25 Litre Tourer <br> +107 more...",
      auctionHouse: "Manor Park Classics"
    },
    {
      auctionTitle: "Southampton Classic Car & Motorcycle Auction",
      auctionStartDateTime: "14062025:13:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Unit 6 Harbour Close, Cracknore Industrial Park, Marchwood, Southampton, SO40 4AF, UK",
      auctionLat: 50.8907989,
      auctionLng: -1.4710819,
      auctionPhone: "02380 668413",
      auctionCity: "Southampton",
      auctionPostalCode: "SO40 4AF",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/manor-park-classics-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Hampshire",
      auctionSlug: "southampton-classic-car-motorcycle-auction",
      auctionFeatured: false,
      auctionHighlights: "1997 Ducati 996 SPS - Estimate: £17,000 - £19,000",
      auctionHighlightsHtml: "1997 Ducati 996 SPS - Estimate: £17,000 - £19,000",
      auctionHouse: "Manor Park Classics"
    },
    {
      auctionTitle: "July 2025 Classic Car Auction",
      auctionStartDateTime: "26072025:11:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Ikon House, Tudor Road, Runcorn, Cheshire, WA7 1TA, UK",
      auctionLat: 53.3447861,
      auctionLng: -2.6787376,
      auctionPhone: "01925 210035",
      auctionCity: "Runcorn",
      auctionPostalCode: "WA7 1TA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/manor-park-classics-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "july-2025-classic-car-auction",
      auctionFeatured: false,
      auctionHighlights: "1983 Ford Cortina 3.0 S Evocation - Estimate: £8,500 - £9,500",
      auctionHighlightsHtml: "Preview available soon",
      auctionHouse: "Manor Park Classics"
    },
    {
      auctionTitle: "September 2025 Classic Car & Motorcycle Auction",
      auctionStartDateTime: "27092025:11:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Ikon House, Tudor Road, Runcorn, Cheshire, WA7 1TA, UK",
      auctionLat: 53.3447861,
      auctionLng: -2.6787376,
      auctionPhone: "01925 210035",
      auctionCity: "Runcorn",
      auctionPostalCode: "WA7 1TA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/manor-park-classics-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "september-2025-classic-car-motorcycle-auction",
      auctionFeatured: false,
      auctionHighlights: "1984 Yamaha RZV500R - Estimate: £13,000 - £15,000",
      auctionHighlightsHtml: "Preview available soon",
      auctionHouse: "Manor Park Classics"
    },
    {
      auctionTitle: "October 2025 Classic Car Auction",
      auctionStartDateTime: "25102025:11:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Ikon House, Tudor Road, Runcorn, Cheshire, WA7 1TA, UK",
      auctionLat: 53.367891,
      auctionLng: -2.713139,
      auctionPhone: "01925 210035",
      auctionCity: "Runcorn",
      auctionPostalCode: "WA7 1TA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/manor-park-classics-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "october-2025-classic-car-auction",
      auctionFeatured: false,
      auctionHighlights: "1956 BSA DBD34 Gold Star - Estimate: £9,000 - £11,000",
      auctionHighlightsHtml: "Preview available soon",
      auctionHouse: "Manor Park Classics"
    },
    {
      auctionTitle: "December 2025 Christmas Auction",
      auctionStartDateTime: "13122025:11:00:00",
      auctionWebsite: "https://www.manorparkclassics.com/upcoming-auctions/",
      auctionAddress: "Ikon House, Tudor Road, Runcorn, Cheshire, WA7 1TA, UK",
      auctionLat: 53.367891,
      auctionLng: -2.713139,
      auctionPhone: "01925 210035",
      auctionCity: "Runcorn",
      auctionPostalCode: "WA7 1TA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auction-houses/manor-park-classics-logo.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "Cheshire",
      auctionSlug: "december-2025-christmas-auction",
      auctionFeatured: false,
      auctionHighlights: "1947 Matchless G3L - Estimate: £2,990 - £3,500",
      auctionHighlightsHtml: "Preview available soon",
      auctionHouse: "Manor Park Classics"
    },

    // ============ MATHEWSONS ============
    {
      auctionTitle: "June Classic Vehicles & Memorabilia Auction",
      auctionStartDateTime: "25062025:10:00:00",
      auctionWebsite: "https://www.mathewsons.co.uk/auction/details/-june-classic-vehicles--memorabilia-auction/?au=104",
      auctionAddress: "10 Enterprise Way, Thornton Road, Pickering, North Yorkshire",
      auctionLat: 54.2370631,
      auctionLng: -0.7645434,
      auctionPhone: "01751 474455",
      auctionCity: "Pickering",
      auctionPostalCode: "YO18 7NA",
      auctionCountryCode: "GB",
      auctionImageUrl: "/assets/images/auctions/mathewsons-june-2025-classic-vehicles.avif",
      auctionCategory: "Classic Car Auctions",
      auctionState: "North Yorkshire",
      auctionSlug: "june-2025-classic-vehicles-memorabilia-auction",
      auctionFeatured: false,
      auctionHighlights: "Classic Vehicles and Automobilia Memorabilia",
      auctionHighlightsHtml: "Three-day classic vehicle auction<br>Wednesday (Lots 1-300)<br>Thursday (Lots 301-600)<br>Friday (Lots 601-900)",
      auctionHouse: "Mathewsons"
    },

    // ============ MORRIS LESLIE ============
    // No auctions listed for Morris Leslie in your data
  ];

  // Sort auctions by date
  auctions.sort((a, b) => {
    const dateA = parseAuctionDate(a.auctionStartDateTime);
    const dateB = parseAuctionDate(b.auctionStartDateTime);

    // Handle cases where dates might be null or invalid
    if (!dateA && !dateB) return 0; // both are invalid/null, consider them equal
    if (!dateA) return 1; // null/invalid dateA comes after valid dateB
    if (!dateB) return -1; // null/invalid dateB comes after valid dateA

    return dateA - dateB; // Ascending order
  });

  // Return only upcoming auctions (filtered and sorted)
  return filterUpcomingAuctions(auctions);
};