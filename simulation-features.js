// Simulation and Advanced Features

// Tree Growth Simulation
const GrowthSimulation = {
    // Get growth stage based on years
    getGrowthStage(years) {
        if (years === 0) return { stage: 'Seed', icon: '🌱', size: 0.5, description: 'Just planted' };
        if (years < 1) return { stage: 'Sapling', icon: '🌿', size: 1, description: 'Young and growing' };
        if (years < 5) return { stage: 'Young Tree', icon: '🌳', size: 3, description: 'Growing strong' };
        if (years < 20) return { stage: 'Mature Tree', icon: '🌲', size: 5, description: 'Fully grown' };
        return { stage: 'Ancient Tree', icon: '🪵', size: 8, description: 'Old and wise' };
    },

    // Calculate growth-based CO2 absorption
    calculateGrowthCO2(baseCO2PerYear, years, count) {
        const stages = [];
        let cumulative = 0;

        for (let year = 1; year <= years; year++) {
            const growthFactor = this.getGrowthFactor(year, years);
            const yearCO2 = baseCO2PerYear * count * growthFactor;
            cumulative += yearCO2;
            const stage = this.getGrowthStage(year);

            stages.push({
                year: year,
                stage: stage.stage,
                icon: stage.icon,
                growthFactor: growthFactor,
                annualCO2: yearCO2,
                cumulativeCO2: cumulative,
                description: stage.description
            });
        }

        return stages;
    },

    // Get growth factor (0.3 to 1.0 based on age)
    getGrowthFactor(year, maxYears) {
        if (year <= 1) return 0.3; // 30% in first year
        if (year <= 3) return 0.5; // 50% in years 2-3
        if (year <= 5) return 0.7; // 70% in years 4-5
        if (year <= 10) return 0.9; // 90% in years 6-10
        return 1.0; // 100% after 10 years
    },

    // Generate growth animation data
    generateGrowthAnimation(species, count, years) {
        const tree = getTreeData(species);
        const baseCO2 = tree ? (tree.co2PerYear || tree) : 20;
        const stages = this.calculateGrowthCO2(baseCO2, years, count);

        return {
            species: species,
            count: count,
            years: years,
            stages: stages,
            finalStage: this.getGrowthStage(years)
        };
    }
};

// Before/After Pollution Simulation
const PollutionSimulation = {
    // Simulate before/after pollution impact
    simulate(scenario) {
        // scenario: { city, currentAQI, treesToPlant, species }
        const results = {
            before: {
                aqi: scenario.currentAQI,
                pm25: scenario.currentAQI * 0.8, // Approximate
                pm10: scenario.currentAQI * 1.2,
                healthImpact: this.calculateHealthImpact(scenario.currentAQI),
                treesNeeded: this.calculateTreesNeeded(scenario.currentAQI)
            },
            after100: {
                trees: 100,
                aqi: this.calculateNewAQI(scenario.currentAQI, 100, scenario.species),
                pm25: 0,
                pm10: 0,
                co2Offset: this.calculateCO2Offset(100, scenario.species),
                healthImpact: 0,
                improvement: 0
            },
            after500: {
                trees: 500,
                aqi: this.calculateNewAQI(scenario.currentAQI, 500, scenario.species),
                pm25: 0,
                pm10: 0,
                co2Offset: this.calculateCO2Offset(500, scenario.species),
                healthImpact: 0,
                improvement: 0
            },
            after1000: {
                trees: 1000,
                aqi: this.calculateNewAQI(scenario.currentAQI, 1000, scenario.species),
                pm25: 0,
                pm10: 0,
                co2Offset: this.calculateCO2Offset(1000, scenario.species),
                healthImpact: 0,
                improvement: 0
            },
            optimal: {
                trees: scenario.treesToPlant || this.calculateTreesNeeded(scenario.currentAQI),
                aqi: 50, // Target healthy AQI
                pm25: 30,
                pm10: 50,
                co2Offset: 0,
                healthImpact: this.calculateHealthImpact(50),
                improvement: ((scenario.currentAQI - 50) / scenario.currentAQI) * 100
            }
        };

        // Calculate after scenarios
        ['after100', 'after500', 'after1000'].forEach(key => {
            results[key].pm25 = results[key].aqi * 0.8;
            results[key].pm10 = results[key].aqi * 1.2;
            results[key].healthImpact = this.calculateHealthImpact(results[key].aqi);
            results[key].improvement = ((scenario.currentAQI - results[key].aqi) / scenario.currentAQI) * 100;
        });

        results.optimal.co2Offset = this.calculateCO2Offset(results.optimal.trees, scenario.species);

        return results;
    },

    // Calculate new AQI after tree planting (simplified model)
    calculateNewAQI(currentAQI, trees, species) {
        const tree = getTreeData(species || 'Neem');
        const co2PerYear = tree ? (tree.co2PerYear || tree) : 20;
        
        // Simplified: Each tree reduces AQI by a small amount
        // 1 tree = ~0.01 AQI reduction per year (very simplified)
        const reduction = (trees * co2PerYear) / (currentAQI * 1000); // Scale based on CO2 absorption
        const newAQI = Math.max(50, currentAQI - (reduction * currentAQI * 0.1)); // Max 10% reduction per year
        
        return Math.round(newAQI);
    },

    // Calculate trees needed for healthy AQI (50)
    calculateTreesNeeded(currentAQI) {
        if (currentAQI <= 50) return 0;
        // Rough estimate: 10 trees per 10 AQI points to reduce
        return Math.ceil(((currentAQI - 50) / 10) * 10);
    },

    // Calculate CO2 offset
    calculateCO2Offset(trees, species) {
        const tree = getTreeData(species || 'Neem');
        const co2PerYear = tree ? (tree.co2PerYear || tree) : 20;
        return co2PerYear * trees;
    },

    // Calculate health impact (simplified)
    calculateHealthImpact(aqi) {
        if (aqi <= 50) return { level: 'Good', risk: 'Minimal', color: '#4CAF50' };
        if (aqi <= 100) return { level: 'Moderate', risk: 'Low', color: '#8BC34A' };
        if (aqi <= 150) return { level: 'Unhealthy for Sensitive', risk: 'Medium', color: '#FFC107' };
        if (aqi <= 200) return { level: 'Unhealthy', risk: 'High', color: '#FF9800' };
        if (aqi <= 300) return { level: 'Very Unhealthy', risk: 'Very High', color: '#F44336' };
        return { level: 'Hazardous', risk: 'Extreme', color: '#9C27B0' };
    }
};

// Real-time AQI Daily Offset Calculator
const RealTimeAQI = {
    // Calculate daily offset for today's AQI
    calculateDailyOffset(city, trees) {
        // Get today's AQI (would fetch from API in production)
        const todayAQI = this.getTodayAQI(city);
        const healthImpact = PollutionSimulation.calculateHealthImpact(todayAQI);
        
        // Calculate how much trees offset today
        const treeData = trees.reduce((sum, tree) => {
            const treeInfo = getTreeData(tree.species);
            const dailyCO2 = treeInfo ? ((treeInfo.co2PerYear || treeInfo) / 365) * tree.count : 0;
            const dailyO2 = treeInfo ? ((treeInfo.oxygenPerYear || (treeInfo.co2PerYear * 60)) / 365) * tree.count : 0;
            
            return {
                totalCO2: sum.totalCO2 + dailyCO2,
                totalO2: sum.totalO2 + dailyO2,
                count: sum.count + tree.count
            };
        }, { totalCO2: 0, totalO2: 0, count: 0 });

        // Estimate daily AQI reduction
        const dailyAQIReduction = (treeData.totalCO2 / 1000) * 0.5; // Simplified
        const projectedAQI = Math.max(50, todayAQI - dailyAQIReduction);

        return {
            city: city,
            todayAQI: todayAQI,
            healthImpact: healthImpact,
            trees: treeData.count,
            dailyCO2Offset: treeData.totalCO2,
            dailyO2Production: treeData.totalO2,
            projectedAQI: Math.round(projectedAQI),
            aqiReduction: Math.round(dailyAQIReduction),
            treesNeededForHealthy: PollutionSimulation.calculateTreesNeeded(todayAQI),
            message: this.generateMessage(todayAQI, treeData.count, dailyAQIReduction)
        };
    },

    // Get today's AQI (simplified - would use API)
    getTodayAQI(city) {
        // In production, fetch from OpenAQ API
        // For now, use mock data based on city
        const cityAQI = {
            'Delhi': 320,
            'Mumbai': 180,
            'Chennai': 120,
            'Bangalore': 110,
            'Kolkata': 210,
            'Hyderabad': 140,
            'Pune': 100,
            'Jaipur': 160,
            'Ahmedabad': 200
        };
        return cityAQI[city] || 150;
    },

    // Generate personalized message
    generateMessage(aqi, trees, reduction) {
        if (aqi > 200) {
            return `Your ${trees} trees are helping reduce today's hazardous AQI. Plant ${Math.ceil((aqi - 200) / 10)} more Neem trees to reach safer levels.`;
        }
        if (aqi > 150) {
            return `Good progress! Your trees are offsetting pollution. Consider planting ${Math.ceil((aqi - 150) / 10)} more trees for better air quality.`;
        }
        if (aqi > 100) {
            return `Your trees are making a difference! Today's air is moderate. Keep planting to reach healthy levels.`;
        }
        return `Excellent! Your trees are contributing to healthy air quality. Keep up the great work!`;
    }
};

// Multi-City Planner (moved from climate-features.js to avoid circular reference)
const MultiCityPlannerEnhanced = {
    // Plan across multiple cities
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
            totals: totals,
            recommendations: this.generateRecommendations(Object.values(cityPlans))
        };
    },

    // Generate recommendations for multi-city plan
    generateRecommendations(cityPlans) {
        const recommendations = [];
        
        // Find city with highest pollution
        const highPollutionCity = cityPlans.reduce((max, plan) => {
            const aqi = RealTimeAQI.getTodayAQI(plan.city);
            return aqi > (max.aqi || 0) ? { city: plan.city, aqi: aqi } : max;
        }, { city: null, aqi: 0 });

        if (highPollutionCity.city) {
            recommendations.push({
                type: 'Priority City',
                message: `${highPollutionCity.city} has the highest AQI (${highPollutionCity.aqi}). Focus on planting pollution-tolerant trees here.`,
                priority: 'High'
            });
        }

        // Climate optimization
        cityPlans.forEach(plan => {
            const climate = ClimateRecommender.getClimateZone(plan.city);
            const climateRecs = ClimateRecommender.getClimateRecommendations(plan.city);
            if (climateRecs.recommendedTrees.length > 0) {
                recommendations.push({
                    type: 'Climate Match',
                    city: plan.city,
                    message: `Best trees for ${plan.city} (${climate.zone}): ${climateRecs.recommendedTrees.slice(0, 3).map(t => t.species).join(', ')}`,
                    priority: 'Medium'
                });
            }
        });

        return recommendations;
    }
};

// Export MultiCityPlanner
window.MultiCityPlanner = MultiCityPlannerEnhanced;

// Global Impact Meter
const GlobalImpact = {
    // Calculate global impact from all users (simulated)
    calculateGlobalImpact() {
        // Get all calculations from localStorage
        const allCalculations = Calculations.getAll();
        const allPins = MapPins.getAll();
        
        // Aggregate data
        const global = {
            totalUsers: 1, // Single user in localStorage
            totalTrees: allCalculations.reduce((sum, calc) => sum + (calc.count || 0), 0) +
                       allPins.reduce((sum, pin) => sum + (pin.count || 0), 0),
            totalCO2: allCalculations.reduce((sum, calc) => sum + (calc.totalCO2 || 0), 0) +
                     allPins.reduce((sum, pin) => {
                         const tree = getTreeData(pin.species);
                         const co2 = tree ? (tree.co2PerYear || tree) : 20;
                         return sum + (co2 * (pin.count || 0) * (pin.years || 1));
                     }, 0),
            totalO2: allCalculations.reduce((sum, calc) => {
                const tree = getTreeData(calc.species);
                const o2 = tree ? (tree.oxygenPerYear || (tree.co2PerYear * 60)) : 1200;
                return sum + (o2 * (calc.count || 0));
            }, 0),
            speciesDistribution: {},
            cityDistribution: {},
            topSpecies: []
        };

        // Count species
        allCalculations.forEach(calc => {
            global.speciesDistribution[calc.species] = (global.speciesDistribution[calc.species] || 0) + (calc.count || 0);
        });
        allPins.forEach(pin => {
            global.speciesDistribution[pin.species] = (global.speciesDistribution[pin.species] || 0) + (pin.count || 0);
        });

        // Count cities
        allCalculations.forEach(calc => {
            if (calc.location) {
                global.cityDistribution[calc.location] = (global.cityDistribution[calc.location] || 0) + (calc.count || 0);
            }
        });
        allPins.forEach(pin => {
            if (pin.location) {
                global.cityDistribution[pin.location] = (global.cityDistribution[pin.location] || 0) + (pin.count || 0);
            }
        });

        // Top species
        global.topSpecies = Object.entries(global.speciesDistribution)
            .map(([species, count]) => ({ species, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Calculate people supported
        global.peopleSupported = OxygenCalculator.calculatePeopleSupported(global.totalO2);

        return global;
    }
};

