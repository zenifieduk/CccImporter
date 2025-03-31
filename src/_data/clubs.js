// Import the processed clubs data from clubs-orig.js
const processedClubs = require('./clubs-orig.js');

// Function to extract car marque from club title
function extractMarque(title) {
    // Common car manufacturers/marques to look for in club names
    const marques = [
        "Aston Martin",
        "Bentley",
        "Jaguar",
        "Land Rover",
        "Lotus",
        "McLaren",
        "MG",
        "Mini",
        "Morgan",
        "Rolls-Royce",
        "Rover",
        "Triumph",
        "TVR",
        "Vauxhall",
        "Austin",
        "Morris",
        "Alvis",
        "Ford",
        "Peugeot",
        "Citroën",
        "Renault",
        "Alfa Romeo",
        "Ferrari",
        "Lamborghini",
        "Maserati",
        "Fiat",
        "Lancia",
        "BMW",
        "Mercedes-Benz",
        "Porsche",
        "Volkswagen",
        "Audi",
        "Volvo",
        "Saab",
        "Toyota",
        "Nissan",
        "Datsun",
        "Honda",
        "Mazda",
        "Subaru",
        "Mitsubishi",
        "Chevrolet",
        "Cadillac",
        "Buick",
        "Oldsmobile",
        "Pontiac",
        "Lincoln",
        "Chrysler",
        "Dodge",
        "Plymouth",
        "DeLorean",
        "Jensen",
        "Sunbeam",
        "Austin-Healey",
        "Reliant",
        "Riley",
        "Daimler",
        "Hillman",
        "Humber",
        "Wolseley",
    ];

    for (const marque of marques) {
        if (title.includes(marque)) {
            return marque;
        }
    }

    // Check for patterns like "XYZ Car Club" or "ABC Owners Club" where XYZ/ABC might be the marque
    const patterns = [
        /^(\w+)\s+Car\s+Club/i,
        /^(\w+)\s+Owners\s+Club/i,
        /^(\w+)\s+Drivers\s+Club/i,
        /^(\w+)\s+Enthusiasts\s+Club/i,
        /^(\w+)\s+Register/i,
    ];

    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    // Default if no marque found
    return "Classic";
}

// Function to normalize categories for consistent filtering
function normalizeCategory(category) {
    category = category || "Classic Car Club";
    
    if (!category) return "Classic Car Club";
    
    // Case insensitive matching for normalization
    category = category.toLowerCase();
    
    // Map various categories to standardized ones
    if (category.includes("car") || category.includes("auto") || category.includes("motor")) {
        return "Classic Car Club";
    }
    
    if (category.includes("motor") && category.includes("cycle")) {
        return "Motorcycle Club";
    }
    
    if (category.includes("race") || category.includes("rally") || category.includes("racing")) {
        return "Racing Club";
    }
    
    if (category.includes("truck") || category.includes("commercial")) {
        return "Commercial Vehicle Club";
    }
    
    if (category.includes("military")) {
        return "Military Vehicle Club";
    }
    
    if (category.includes("4x4") || category.includes("off road") || category.includes("offroad")) {
        return "4x4 & Off-Road Club";
    }
    
    if (category.includes("hot rod") || category.includes("hotrod") || category.includes("custom")) {
        return "Hot Rod & Custom Club";
    }
    
    // Default if no mapping found
    return "Classic Car Club";
}

// Process each club and add any needed fields
const enhancedClubs = processedClubs.map((club, index) => {
    return {
        ...club,
        marque: extractMarque(club.title),
        category: normalizeCategory(club.category),
        // Add a unique ID for each club
        id: index + 1,
        // Set a default image if none exists
        imageUrl: club.imageUrl || `/assets/images/clubs/default-club-image.jpg`,
        // Mark some clubs as featured to display on homepage
        featured: club.featured || false,
    };
});

// Manually set some clubs as featured for the homepage
// Let's select 8 clubs to be featured (choose every ~100th club)
for (let i = 0; i < enhancedClubs.length; i += Math.floor(enhancedClubs.length / 8)) {
    if (i < enhancedClubs.length) {
        enhancedClubs[i].featured = true;
    }
}

// Export the enhanced clubs array
module.exports = enhancedClubs;