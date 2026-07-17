// Climate-Based Tree Plantation Features

// City Climate Zones Mapping - Now populated from INDIAN_CITIES
const CITY_CLIMATE_ZONES = {};
// Populate from INDIAN_CITIES if available
if (typeof INDIAN_CITIES !== 'undefined') {
    Object.keys(INDIAN_CITIES).forEach(city => {
        CITY_CLIMATE_ZONES[city] = {
            zone: INDIAN_CITIES[city].zone,
            subzone: INDIAN_CITIES[city].subzone,
            avgTemp: INDIAN_CITIES[city].avgTemp,
            rainfall: INDIAN_CITIES[city].rainfall,
            humidity: INDIAN_CITIES[city].humidity
        };
    });
} else {
    // Fallback to basic cities
    CITY_CLIMATE_ZONES['Mumbai'] = { zone: 'Tropical', subzone: 'Tropical Monsoon', avgTemp: 27, rainfall: 2400, humidity: 75 };
    CITY_CLIMATE_ZONES['Chennai'] = { zone: 'Tropical', subzone: 'Tropical Wet and Dry', avgTemp: 28, rainfall: 1200, humidity: 70 };
    CITY_CLIMATE_ZONES['Kolkata'] = { zone: 'Tropical', subzone: 'Tropical Monsoon', avgTemp: 27, rainfall: 1800, humidity: 80 };
    CITY_CLIMATE_ZONES['Hyderabad'] = { zone: 'Tropical', subzone: 'Tropical Wet and Dry', avgTemp: 26, rainfall: 800, humidity: 60 };
    CITY_CLIMATE_ZONES['Bangalore'] = { zone: 'Tropical', subzone: 'Tropical Savanna', avgTemp: 24, rainfall: 970, humidity: 65 };
    CITY_CLIMATE_ZONES['Goa'] = { zone: 'Tropical', subzone: 'Tropical Monsoon', avgTemp: 27, rainfall: 3000, humidity: 85 };
    CITY_CLIMATE_ZONES['Delhi'] = { zone: 'Subtropical', subzone: 'Semi-Arid', avgTemp: 25, rainfall: 700, humidity: 50 };
    CITY_CLIMATE_ZONES['Ahmedabad'] = { zone: 'Subtropical', subzone: 'Semi-Arid', avgTemp: 27, rainfall: 800, humidity: 55 };
    CITY_CLIMATE_ZONES['Jaipur'] = { zone: 'Subtropical', subzone: 'Hot Semi-Arid', avgTemp: 26, rainfall: 650, humidity: 45 };
    CITY_CLIMATE_ZONES['Pune'] = { zone: 'Subtropical', subzone: 'Tropical Savanna', avgTemp: 24, rainfall: 700, humidity: 60 };
    CITY_CLIMATE_ZONES['Lucknow'] = { zone: 'Subtropical', subzone: 'Humid Subtropical', avgTemp: 26, rainfall: 1000, humidity: 65 };
    CITY_CLIMATE_ZONES['Kanpur'] = { zone: 'Subtropical', subzone: 'Humid Subtropical', avgTemp: 26, rainfall: 900, humidity: 60 };
    CITY_CLIMATE_ZONES['Shimla'] = { zone: 'Temperate', subzone: 'Subtropical Highland', avgTemp: 17, rainfall: 1600, humidity: 70 };
    CITY_CLIMATE_ZONES['Darjeeling'] = { zone: 'Temperate', subzone: 'Subtropical Highland', avgTemp: 12, rainfall: 3000, humidity: 85 };
    CITY_CLIMATE_ZONES['Ooty'] = { zone: 'Temperate', subzone: 'Oceanic', avgTemp: 14, rainfall: 1200, humidity: 75 };
    CITY_CLIMATE_ZONES['Jaisalmer'] = { zone: 'Arid', subzone: 'Hot Desert', avgTemp: 28, rainfall: 200, humidity: 30 };
    CITY_CLIMATE_ZONES['Bikaner'] = { zone: 'Arid', subzone: 'Hot Desert', avgTemp: 27, rainfall: 250, humidity: 35 };
    CITY_CLIMATE_ZONES['Rajkot'] = { zone: 'Arid', subzone: 'Semi-Arid', avgTemp: 27, rainfall: 600, humidity: 50 };
}

// Climate-Based Recommendations
const ClimateRecommender = {
    // Get climate zone for a city
    getClimateZone(city) {
        return CITY_CLIMATE_ZONES[city] || { 
            zone: 'Tropical', 
            subzone: 'Tropical', 
            avgTemp: 25, 
            rainfall: 1000, 
            humidity: 60 
        };
    },

    // Get best trees for climate zone
    getTreesForClimate(zone, subzone = null) {
        const suitableTrees = [];

        Object.keys(TREE_SPECIES).forEach(species => {
            const tree = getTreeData(species);
            if (tree && tree.climateZones && tree.climateZones.includes(zone)) {
                const score = this.calculateClimateScore(tree, zone, subzone);
                suitableTrees.push({
                    species: species,
                    score: score,
                    co2PerYear: tree.co2PerYear,
                    oxygenPerYear: tree.oxygenPerYear,
                    pollutionTolerance: tree.pollutionTolerance,
                    survivalRisk: tree.survivalRisk,
                    waterPerWeek: tree.waterPerWeek
                });
            }
        });

        return suitableTrees.sort((a, b) => b.score - a.score);
    },

    // Calculate climate suitability score
    calculateClimateScore(tree, zone, subzone) {
        let score = 100;

        // Base score from CO2 absorption
        score += tree.co2PerYear * 0.5;

        // Adjust for climate zone match
        const zoneMatch = tree.climateZones.includes(zone) ? 20 : 0;
        score += zoneMatch;

        // Adjust for pollution tolerance (important in cities)
        const pollutionScore = {
            'Very High': 15,
            'High': 10,
            'Medium': 5,
            'Low': 0
        };
        score += pollutionScore[tree.pollutionTolerance] || 0;

        // Adjust for survival risk (lower risk = higher score)
        const survivalScore = {
            'Very Low': 15,
            'Low': 10,
            'Medium': 5,
            'High': 0
        };
        score += survivalScore[tree.survivalRisk] || 0;

        return score;
    },

    // Get best planting months for climate
    getBestPlantingMonths(zone, subzone) {
        const plantingCalendar = {
            'Tropical': {
                'Tropical Monsoon': ['June', 'July', 'August', 'September'],
                'Tropical Wet and Dry': ['June', 'July', 'August'],
                'Tropical Savanna': ['May', 'June', 'July', 'August']
            },
            'Subtropical': {
                'Semi-Arid': ['July', 'August', 'September'],
                'Hot Semi-Arid': ['July', 'August'],
                'Humid Subtropical': ['June', 'July', 'August', 'September']
            },
            'Temperate': {
                'Subtropical Highland': ['April', 'May', 'June', 'September', 'October'],
                'Oceanic': ['March', 'April', 'May', 'September', 'October']
            },
            'Arid': {
                'Hot Desert': ['July', 'August'],
                'Semi-Arid': ['July', 'August', 'September']
            }
        };

        return plantingCalendar[zone]?.[subzone] || ['June', 'July', 'August'];
    },

    // Get climate-specific recommendations
    getClimateRecommendations(city) {
        const climate = this.getClimateZone(city);
        const trees = this.getTreesForClimate(climate.zone, climate.subzone);
        const bestMonths = this.getBestPlantingMonths(climate.zone, climate.subzone);

        return {
            city: city,
            climate: climate,
            recommendedTrees: trees.slice(0, 10), // Top 10
            bestPlantingMonths: bestMonths,
            considerations: this.getClimateConsiderations(climate)
        };
    },

    // Get climate-specific considerations
    getClimateConsiderations(climate) {
        const considerations = [];

        if (climate.zone === 'Tropical') {
            considerations.push('High rainfall - ensure good drainage');
            considerations.push('Monsoon planting recommended');
            considerations.push('Protect from excessive waterlogging');
        }

        if (climate.zone === 'Subtropical' && climate.subzone.includes('Arid')) {
            considerations.push('Low rainfall - irrigation essential');
            considerations.push('Drought-resistant species preferred');
            considerations.push('Mulching recommended to retain moisture');
        }

        if (climate.zone === 'Temperate') {
            considerations.push('Consider frost protection for young trees');
            considerations.push('Spring and autumn are ideal planting seasons');
            considerations.push('Moderate watering required');
        }

        if (climate.zone === 'Arid') {
            considerations.push('Very low rainfall - daily watering needed initially');
            considerations.push('Drought-tolerant species are essential');
            considerations.push('Consider shade structures for young trees');
        }

        if (climate.humidity > 70) {
            considerations.push('High humidity - watch for fungal diseases');
            considerations.push('Ensure good air circulation');
        }

        if (climate.avgTemp > 28) {
            considerations.push('High temperature - provide shade for young trees');
            considerations.push('Water during early morning or evening');
        }

        return considerations;
    }
};

// Climate-Based Calendar
const ClimateCalendar = {
    // Get planting calendar for a city
    getPlantingCalendar(city) {
        const climate = ClimateRecommender.getClimateZone(city);
        const allTrees = Object.keys(TREE_SPECIES);
        const calendar = {};

        allTrees.forEach(species => {
            const tree = getTreeData(species);
            if (tree && tree.bestPlantingMonths) {
                tree.bestPlantingMonths.forEach(month => {
                    if (!calendar[month]) {
                        calendar[month] = [];
                    }
                    // Check if tree is suitable for climate
                    if (tree.climateZones && tree.climateZones.includes(climate.zone)) {
                        calendar[month].push({
                            species: species,
                            co2PerYear: tree.co2PerYear,
                            priority: this.getPriority(tree, climate)
                        });
                    }
                });
            }
        });

        // Sort trees in each month by priority
        Object.keys(calendar).forEach(month => {
            calendar[month].sort((a, b) => b.priority - a.priority);
        });

        return {
            city: city,
            climate: climate,
            calendar: calendar
        };
    },

    // Calculate priority for tree in climate
    getPriority(tree, climate) {
        let priority = 0;

        // Climate match
        if (tree.climateZones && tree.climateZones.includes(climate.zone)) {
            priority += 50;
        }

        // CO2 absorption
        priority += tree.co2PerYear;

        // Pollution tolerance (important for cities)
        const pollutionValue = {
            'Very High': 30,
            'High': 20,
            'Medium': 10,
            'Low': 5
        };
        priority += pollutionValue[tree.pollutionTolerance] || 0;

        return priority;
    }
};

// Multi-City Climate Planner
const MultiCityPlanner = {
    // Plan plantations across multiple cities
    planMultiCity(plantations) {
        // plantations: [{city, species, count, years}]
        const cityPlans = {};

        plantations.forEach(plant => {
            if (!cityPlans[plant.city]) {
                cityPlans[plant.city] = {
                    city: plant.city,
                    climate: ClimateRecommender.getClimateZone(plant.city),
                    trees: [],
                    totalCount: 0,
                    totalCO2: 0,
                    totalO2: 0
                };
            }

            const tree = getTreeData(plant.species);
            const co2PerYear = tree ? (tree.co2PerYear || tree) : 20;
            const oxygenPerYear = tree ? (tree.oxygenPerYear || (co2PerYear * 60)) : 1200;
            const years = plant.years || 1;

            cityPlans[plant.city].trees.push({
                species: plant.species,
                count: plant.count || 0,
                co2PerYear: co2PerYear * (plant.count || 0),
                oxygenPerYear: oxygenPerYear * (plant.count || 0),
                totalCO2: co2PerYear * (plant.count || 0) * years,
                totalO2: oxygenPerYear * (plant.count || 0) * years
            });

            cityPlans[plant.city].totalCount += plant.count || 0;
            cityPlans[plant.city].totalCO2 += co2PerYear * (plant.count || 0) * years;
            cityPlans[plant.city].totalO2 += oxygenPerYear * (plant.count || 0) * years;
        });

        // Calculate totals
        const totals = {
            cities: Object.keys(cityPlans).length,
            totalTrees: Object.values(cityPlans).reduce((sum, plan) => sum + plan.totalCount, 0),
            totalCO2: Object.values(cityPlans).reduce((sum, plan) => sum + plan.totalCO2, 0),
            totalO2: Object.values(cityPlans).reduce((sum, plan) => sum + plan.totalO2, 0),
            peopleSupported: OxygenCalculator.calculatePeopleSupported(
                Object.values(cityPlans).reduce((sum, plan) => sum + plan.totalO2, 0)
            )
        };

        return {
            cityPlans: Object.values(cityPlans),
            totals: totals
        };
    }
};


