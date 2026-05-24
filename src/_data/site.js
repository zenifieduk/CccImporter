module.exports = {
  title: "Classic Car Clubs UK",
  description:
    "Discover classic car clubs across the UK with contact details and more.",
  url: "https://classiccarclubs.uk",
  author: "Classic Car Clubs UK",
  email: "enquiries@classiccarclubs.uk",
  buildTime: new Date().toISOString(),
  navigation: [
    { label: "Home", url: "/" },
    {
      label: "Club Directory",
      url: "/club-directory/",
      children: [
        { label: "Club Map", url: "/club-map/" },
        { label: "Showcase", url: "/showcase/" }
      ]
    },
    { label: "Events", url: "/club-events/" },
    { 
      label: "Auctions", 
      url: "/auctions/", 
      children: [
        { label: "Auction Calendar", url: "/classic-car-auctions-calendar-uk/" },
        { label: "Auction Houses", url: "/auction-houses/" }
      ]
    },
    { label: "The Classic Chronicle", url: "/chronicle/" },
  ],
  footerLinks: {
    Directory: [
      { label: "All Clubs", url: "/club-directory/" },
      { label: "Club Map", url: "/club-map/" },
      {
        label: "Classic Car Clubs",
        url: "/club-directory/?category=Classic+Car+Club",
      },
      {
        label: "Military Vehicle Clubs",
        url: "/club-directory/?category=Military+Vehicle+Club",
      },
      {
        label: "Motorcycle Clubs",
        url: "/club-directory/?category=Motorcycle+Club",
      },
    ],
    Events: [
      { label: "All Events", url: "/club-events/" },
      { label: "Car Shows", url: "/club-events/?category=Car%20Show" },
      { label: "Meets", url: "/club-events/?category=Car%20Meet" },
      { label: "Featured Events", url: "/club-events/?featured=true" },
    ],
    Auctions: [
      { label: "Auction Calendar", url: "/classic-car-auctions-calendar-uk/" },
      { label: "Classic Car Auctions", url: "/auctions/?category=Classic+Car+auctions#results-section" },
      { label: "Motorcycle Auctions", url: "/auctions/?category=Classic+Motorcycle+auctions#results-section" },
      { label: "Auction Houses", url: "/auction-houses/" },
    ],
    "The Classic Chronicle": [
      { label: "All Articles", url: "/chronicle/" },
      { label: "Classic Cars", url: "/chronicle/tags/classic-cars/" },
      { label: "Events", url: "/chronicle/tags/events/" },
      { label: "News", url: "/chronicle/tags/news/" },
    ],
    About: [
      { label: "Get Listed", url: "/pricing/" },
      { label: "Club Website Design", url: "/club-websites/" },
      { label: "Advertise With Us", url: "/advertise/" },
      { label: "Contact Us", url: "/contact/" },
    ],
  },
};
