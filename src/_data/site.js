module.exports = {
  title: "Classic Car Clubs | UK Directory",
  description:
    "Discover classic car clubs across the UK with contact details and more.",
  url: process.env.URL || "https://classiccarclubs.uk",
  author: "Classic Car Clubs UK",
  email: "enquiries@classiccarclubs.uk",
  buildTime: new Date(),
  environment: process.env.ELEVENTY_ENV || "development",
  navigation: [
    { label: "Home", url: "/" },
    { label: "Club Directory", url: "/club-directory/" },
    { label: "Club Events", url: "/club-events/" },
    { label: "Contact", url: "/contact/" },
  ],
  footerLinks: {
    Directory: [
      { label: "All Clubs", url: "/club-directory/" },
      {
        label: "Classic Car Clubs",
        url: "/club-directory/?category=Classic+Car+Club",
      },
      {
        label: "Miltary Vehicle Clubs",
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
    About: [
      { label: "Privacy Policy", url: "/privacy-policy/" },
      { label: "Submit a Club", url: "/submit-club/" },
      { label: "Club Website Design", url: "/club-websites/" },
      { label: "Advertise With Us", url: "/advertise/" },
    ],
  },
};
