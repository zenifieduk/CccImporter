# Club Data Scraper for ClassicCarClubs.uk

This tool helps you quickly extract data from classic car club websites to populate your `clubs.js` file with minimal manual effort.

## Prerequisites

Before using this tool, you'll need to have Node.js installed on your computer. You'll also need to install the required dependencies:

```bash
npm install axios cheerio jsdom
```

## How to Use

### Basic Usage

```bash
node club-data-scraper.js <club-website-url>
```

For example:

```bash
node club-data-scraper.js https://www.mgcarclub.co.uk
```

This will scrape the website, extract as much information as possible, and output the data in the correct format for `clubs.js`.

### Options

You can customize the scraping process with these command-line options:

- `--showcase`: Mark the club as a showcase club (collects additional information)
- `--featured`: Mark the club as a featured club
- `--category=<category>`: Specify the club category (e.g., "Car Club", "Classic Vehicle Club")
- `--marque=<marque>`: Specify the vehicle marque/make
- `--country=<country-code>`: Specify the country code (default: GB)
- `--output=<file-path>`: Specify where to save the JSON output

Example with options:

```bash
node club-data-scraper.js https://www.mgcarclub.co.uk --showcase --marque="MG" --category="Classic Car Club" --output=mg-club-data.json
```

## Output

The tool generates:

1. A JSON file with all the extracted data
2. A formatted JavaScript object in the console that you can copy directly into your `clubs.js` file

## Post-Processing

While the scraper tries to collect as much data as possible, you'll likely need to:

1. Review and clean up the scraped content
2. Add or correct any missing or inaccurate information
3. Process and optimize any images (the script only extracts the image URLs)
4. For showcase clubs, you may need to manually enhance:
   - Media gallery images
   - Maps location data
   - Curated events
   - Club ethos
   - Call-to-action links

## Adding to clubs.js

After running the script, locate the SHOWCASE CLUB PLACEHOLDER or the section where you want to add the new club in your `clubs.js` file. Then:

1. Copy the formatted JavaScript object from the console output
2. Paste it into your `clubs.js` file at the appropriate location
3. Review and adjust the data as needed
4. Make sure to maintain proper formatting, especially comma placement

## Requirements Reference

These are the fields needed for a complete club entry:

### Basic Fields (Required for all clubs)
- title
- website
- address
- phone
- email
- city
- postalCode
- countryCode
- imageUrl
- category
- state
- slug
- featured
- showcase
- description
- marque
- membership
- facebook/instagram/linkedin (if available)

### Showcase Fields (Required for showcase clubs)
- showcaseBanner
- showcaseLogo
- showcaseBadge
- quickFacts (members, founded, notableMember, location)
- aboutExpanded
- clubEthos
- curatedEvents
- mediaGallery
- map (hq, hqLat, hqLng, venues)
- ctas (call-to-action links)

## Limitations

The scraper works best on well-structured websites with clear sections for contact info, about text, and events. It might not extract all information from highly customized or poorly structured sites.

In these cases, you may need to:
1. Run the scraper to get the basic structure
2. Manually fill in the missing information
3. Use other sources (social media, contact details, etc.) to complete the profile

## License

This tool is for internal use with the ClassicCarClubs.uk website. 