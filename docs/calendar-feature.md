# Add to Calendar Feature

## Overview

The "Add to Calendar" feature allows visitors to individual auction pages to save auction events directly to their preferred calendar applications.

## Supported Calendar Platforms

- **Google Calendar** - Opens directly in web browser
- **Apple Calendar** - Downloads .ics file for import
- **Outlook Web** - Opens directly in web browser  
- **Yahoo Calendar** - Opens directly in web browser

## Technical Implementation

### Frontend Components

1. **Alpine.js Component** (`calendarData`)
   - Handles dropdown display/hide logic
   - Generates calendar URLs for different platforms
   - Parses auction date from `DDMMYYYY:HH:MM:SS` format
   - Assumes 3-hour duration for auctions

2. **CSS Styling**
   - Dropdown animation and hover effects
   - Mobile-responsive design
   - Professional styling matching site theme

### Backend Components

1. **ICS File Generation** (`src/calendar/calendar.njk`)
   - Creates individual .ics files for each auction
   - Includes all relevant event data (title, date, location, description)
   - Supports geo-coordinates for location
   - Compatible with Apple Calendar, Outlook, and other .ics-compatible apps

### Generated Calendar Data

Each calendar event includes:
- **Title**: Auction title
- **Date/Time**: Parsed from `auctionStartDateTime` 
- **Duration**: 3 hours (ending at 6:00 PM if no specific end time)
- **Location**: Full auction address
- **Description**: Auction highlights + website link + organizer info
- **Organizer**: Auction house name
- **Categories**: "AUCTION, CLASSIC CARS"
- **Geo-coordinates**: If available in auction data

## File Structure

```
src/
├── auctions/
│   └── auction.njk           # Main auction template with calendar feature
├── calendar/
│   └── calendar.njk          # ICS file generator template
└── _data/
    └── auctions.js           # Auction data source
```

## Calendar URLs Generated

### Google Calendar
```
https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={start}/{end}&details={description}&location={location}
```

### Apple Calendar (.ics file)
```
/calendar/{auction-slug}.ics
```

### Outlook Web
```
https://outlook.live.com/calendar/0/deeplink/compose?subject={title}&startdt={start}&enddt={end}&body={description}&location={location}
```

### Yahoo Calendar
```
https://calendar.yahoo.com/?v=60&view=d&type=20&title={title}&st={start}&et={end}&desc={description}&in_loc={location}
```

## Usage

1. Visitors navigate to any auction detail page
2. Click "Add to Calendar" button in the sidebar
3. Select their preferred calendar platform from dropdown
4. Event opens in their chosen calendar application
5. They can save/import the event with one click

## Mobile Compatibility

- Dropdown adapts to mobile screens with centered overlay
- Touch-friendly button sizes
- Automatic calendar app detection on mobile devices
- Works with native calendar apps on iOS/Android

## Future Enhancements

- Add reminder settings (15 minutes, 1 hour, 1 day before)
- Support for recurring events (if auction houses have regular schedules)
- Integration with auction house calendars
- Email reminder option
- Calendar subscription feeds for following specific auction houses 