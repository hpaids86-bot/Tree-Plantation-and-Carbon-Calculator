// Advanced Features Module - EcoTree Impact Analyzer

// Oxygen Release Calculator
const OxygenCalculator = {
    // Calculate oxygen released by trees
    calculateOxygen(species, count, years = 1) {
        const tree = getTreeData(species);
        if (!tree) return null;

        const oxygenPerYear = tree.oxygenPerYear || (tree.co2PerYear * 60);
        const annualOxygen = oxygenPerYear * count;
        const totalOxygen = annualOxygen * years;

        return {
            annual: annualOxygen,
            total: totalOxygen,
            perTreePerYear: oxygenPerYear
        };
    },

    // Calculate how many people can be supported
    calculatePeopleSupported(oxygenKg) {
        const oxygenPerPerson = 740; // kg per year per adult
        return Math.round(oxygenKg / oxygenPerPerson);
    },

    // Calculate oxygen over time with growth curve
    calculateOxygenOverTime(species, count, years) {
        const tree = getTreeData(species);
        if (!tree) return [];

        const oxygenPerYear = tree.oxygenPerYear || (tree.co2PerYear * 60);
        const results = [];

        for (let year = 1; year <= years; year++) {
            const growthFactor = 0.5 + (year / years) * 0.5; // Growth curve
            const yearOxygen = oxygenPerYear * count * growthFactor;
            const cumulative = results.length > 0 
                ? results[results.length - 1].cumulative + yearOxygen
                : yearOxygen;

            results.push({
                year: year,
                annual: Math.round(yearOxygen),
                cumulative: Math.round(cumulative),
                peopleSupported: this.calculatePeopleSupported(cumulative)
            });
        }

        return results;
    }
};

// Smart Tree Combination Optimizer
const TreeOptimizer = {
    // Find optimal tree combination to reach target CO2 reduction
    optimize(targetCO2PerYear) {
        const trees = Object.keys(TREE_SPECIES).map(species => {
            const tree = getTreeData(species);
            return {
                species: species,
                co2PerYear: tree.co2PerYear || tree,
                oxygenPerYear: tree.oxygenPerYear || (tree.co2PerYear * 60),
                waterPerWeek: tree.waterPerWeek || 20,
                cost: tree.costPerSapling || 150
            };
        }).sort((a, b) => b.co2PerYear - a.co2PerYear); // Sort by CO2 absorption

        const solutions = [];
        
        // Greedy algorithm to find combinations
        for (let i = 0; i < Math.min(5, trees.length); i++) {
            const solution = [];
            let remainingCO2 = targetCO2PerYear;
            let totalCost = 0;
            let totalWater = 0;

            // Start with highest CO2 absorber
            let treeIndex = i;
            
            while (remainingCO2 > 0 && treeIndex < trees.length) {
                const tree = trees[treeIndex];
                const count = Math.ceil(remainingCO2 / tree.co2PerYear);
                
                solution.push({
                    species: tree.species,
                    count: count,
                    co2Reduction: tree.co2PerYear * count,
                    oxygenProduction: tree.oxygenPerYear * count,
                    waterRequired: tree.waterPerWeek * count * 52, // per year
                    cost: tree.cost * count
                });

                totalCost += tree.cost * count;
                totalWater += tree.waterPerWeek * count * 52;
                remainingCO2 -= tree.co2PerYear * count;

                if (remainingCO2 > 0) {
                    treeIndex++;
                }
            }

            solutions.push({
                trees: solution,
                totalCO2Reduction: targetCO2PerYear - Math.max(0, remainingCO2),
                totalCost: totalCost,
                totalWaterPerYear: totalWater,
                efficiency: targetCO2PerYear / totalCost, // CO2 per rupee
                peopleSupported: OxygenCalculator.calculatePeopleSupported(
                    solution.reduce((sum, t) => sum + t.oxygenProduction, 0)
                )
            });
        }

        return solutions.sort((a, b) => b.efficiency - a.efficiency);
    }
};

// Water Requirement Calculator
const WaterCalculator = {
    calculateWaterRequirements(species, count, years = 1) {
        const tree = getTreeData(species);
        if (!tree) return null;

        const waterPerWeek = tree.waterPerWeek || 20;
        const waterPerYear = waterPerWeek * 52 * count;
        const totalWater = waterPerYear * years;

        return {
            perWeek: waterPerWeek * count,
            perMonth: (waterPerWeek * count * 52) / 12,
            perYear: waterPerYear,
            total: totalWater
        };
    },

    calculateMultiSpecies(plantations) {
        // plantations: [{species, count, years}]
        let totalPerWeek = 0;
        let totalPerMonth = 0;
        let totalPerYear = 0;

        plantations.forEach(plant => {
            const water = this.calculateWaterRequirements(
                plant.species, 
                plant.count, 
                plant.years || 1
            );
            if (water) {
                totalPerWeek += water.perWeek;
                totalPerMonth += water.perMonth;
                totalPerYear += water.perYear;
            }
        });

        return {
            perWeek: totalPerWeek,
            perMonth: totalPerMonth,
            perYear: totalPerYear
        };
    }
};

// Cost Estimator
const CostEstimator = {
    calculateTotalCost(species, count, years = 1) {
        const tree = getTreeData(species);
        if (!tree) return null;

        const saplingCost = (tree.costPerSapling || 150) * count;
        const maintenanceCost = (tree.maintenanceCost || 200) * count * years;
        const totalCost = saplingCost + maintenanceCost;

        return {
            saplingCost: saplingCost,
            maintenanceCost: maintenanceCost,
            totalCost: totalCost,
            perYear: maintenanceCost / years,
            costPerTree: totalCost / count
        };
    },

    calculateMultiSpecies(plantations) {
        let totalSaplingCost = 0;
        let totalMaintenanceCost = 0;

        plantations.forEach(plant => {
            const cost = this.calculateTotalCost(
                plant.species,
                plant.count,
                plant.years || 1
            );
            if (cost) {
                totalSaplingCost += cost.saplingCost;
                totalMaintenanceCost += cost.maintenanceCost;
            }
        });

        return {
            saplingCost: totalSaplingCost,
            maintenanceCost: totalMaintenanceCost,
            totalCost: totalSaplingCost + totalMaintenanceCost
        };
    }
};

// Soil Suitability Matcher
const SoilSuitability = {
    // Get trees suitable for soil type
    getTreesForSoil(soilType) {
        const suitableTrees = [];

        Object.keys(TREE_SPECIES).forEach(species => {
            const tree = getTreeData(species);
            if (tree && tree.soilTypes && tree.soilTypes.includes(soilType)) {
                suitableTrees.push({
                    species: species,
                    co2PerYear: tree.co2PerYear,
                    oxygenPerYear: tree.oxygenPerYear,
                    pollutionTolerance: tree.pollutionTolerance,
                    diseaseResistance: tree.diseaseResistance,
                    survivalRisk: tree.survivalRisk
                });
            }
        });

        return suitableTrees.sort((a, b) => b.co2PerYear - a.co2PerYear);
    },

    // Get best tree for soil and climate
    getBestTreeForConditions(soilType, climateZone, pollutionLevel = 'Medium') {
        const trees = this.getTreesForSoil(soilType);
        
        // Filter by climate
        const climateFiltered = trees.filter(tree => {
            const treeData = getTreeData(tree.species);
            return treeData && treeData.climateZones && treeData.climateZones.includes(climateZone);
        });

        // Sort by pollution tolerance and CO2 absorption
        return climateFiltered.sort((a, b) => {
            const aData = getTreeData(a.species);
            const bData = getTreeData(b.species);
            
            const pollutionOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            const aTolerance = pollutionOrder[aData.pollutionTolerance] || 0;
            const bTolerance = pollutionOrder[bData.pollutionTolerance] || 0;
            
            if (aTolerance !== bTolerance) {
                return bTolerance - aTolerance;
            }
            
            return b.co2PerYear - a.co2PerYear;
        });
    }
};

// Survival Risk Calculator
const SurvivalRiskCalculator = {
    calculateRisk(species, city, aqi, waterSupply = 'Medium', heatLevel = 'Medium') {
        const tree = getTreeData(species);
        if (!tree) return null;

        let riskScore = 0;

        // Base risk from tree survival risk
        const baseRisk = { 'Very Low': 0.1, 'Low': 0.2, 'Medium': 0.4, 'High': 0.6 };
        riskScore += baseRisk[tree.survivalRisk] || 0.3;

        // Pollution risk
        const pollutionRisk = {
            'Very High': { 'Very High': 0.3, 'High': 0.2, 'Medium': 0.1, 'Low': 0.05 },
            'High': { 'Very High': 0.2, 'High': 0.1, 'Medium': 0.05, 'Low': 0.02 },
            'Medium': { 'Very High': 0.1, 'High': 0.05, 'Medium': 0.02, 'Low': 0.01 },
            'Low': { 'Very High': 0.05, 'High': 0.02, 'Medium': 0.01, 'Low': 0 }
        };

        const pollutionTolerance = tree.pollutionTolerance || 'Medium';
        const aqiLevel = aqi > 300 ? 'Very High' : aqi > 200 ? 'High' : aqi > 150 ? 'Medium' : 'Low';
        riskScore += pollutionRisk[pollutionTolerance]?.[aqiLevel] || 0.1;

        // Water supply risk
        const waterRisk = { 'High': -0.2, 'Medium': 0, 'Low': 0.3 };
        riskScore += waterRisk[waterSupply] || 0;

        // Heat level risk
        const heatRisk = { 'Very High': 0.3, 'High': 0.2, 'Medium': 0.1, 'Low': 0 };
        riskScore += heatRisk[heatLevel] || 0.1;

        // Normalize to 0-1
        riskScore = Math.max(0, Math.min(1, riskScore));

        // Convert to percentage and category
        const riskPercentage = Math.round(riskScore * 100);
        let riskCategory = 'Low';
        if (riskPercentage > 70) riskCategory = 'Very High';
        else if (riskPercentage > 50) riskCategory = 'High';
        else if (riskPercentage > 30) riskCategory = 'Medium';

        return {
            percentage: riskPercentage,
            category: riskCategory,
            score: riskScore,
            factors: {
                baseRisk: baseRisk[tree.survivalRisk] || 0.3,
                pollutionImpact: pollutionRisk[pollutionTolerance]?.[aqiLevel] || 0.1,
                waterImpact: waterRisk[waterSupply] || 0,
                heatImpact: heatRisk[heatLevel] || 0.1
            }
        };
    }
};

// Future Environment Prediction
const FuturePredictor = {
    predict(presentTrees, annualPlanting, years, cityAQI) {
        const predictions = [];
        let cumulativeTrees = presentTrees;
        let cumulativeCO2 = 0;
        let cumulativeO2 = 0;

        for (let year = 1; year <= years; year++) {
            cumulativeTrees += annualPlanting;
            
            // Average CO2 absorption (simplified - using average of all trees)
            const avgCO2PerTree = 25; // kg/year average
            const avgO2PerTree = 1650; // kg/year average
            
            cumulativeCO2 += avgCO2PerTree * annualPlanting;
            cumulativeO2 += avgO2PerTree * annualPlanting;

            // Estimate pollution reduction (simplified model)
            const pollutionReduction = (cumulativeCO2 / 1000000) * 0.1; // Simplified
            const predictedAQI = Math.max(50, cityAQI - (pollutionReduction * cityAQI));

            predictions.push({
                year: year,
                totalTrees: cumulativeTrees,
                newTreesThisYear: annualPlanting,
                cumulativeCO2Reduction: Math.round(cumulativeCO2),
                cumulativeO2Production: Math.round(cumulativeO2),
                predictedAQI: Math.round(predictedAQI),
                pollutionReduction: Math.round((1 - predictedAQI / cityAQI) * 100),
                peopleSupported: OxygenCalculator.calculatePeopleSupported(cumulativeO2)
            });
        }

        return predictions;
    }
};

// Carbon Neutrality Score Calculator
const CarbonNeutralityScore = {
    calculate(progress) {
        const trees = progress.totalTrees || 0;
        const co2Saved = progress.totalCO2 || 0; // in kg
        const calculations = progress.totalCalculations || 0;

        // Base score from trees (max 40 points)
        const treeScore = Math.min(40, (trees / 100) * 40);

        // CO2 saved score (max 40 points) - 1 tonne = 10 points
        const co2Score = Math.min(40, (co2Saved / 1000) * 10);

        // Engagement score (max 20 points) - calculations
        const engagementScore = Math.min(20, calculations * 2);

        const totalScore = Math.round(treeScore + co2Score + engagementScore);
        const maxScore = 100;

        // Determine level
        let level = 'Beginner';
        if (totalScore >= 80) level = 'Planet Protector';
        else if (totalScore >= 60) level = 'Air Saver';
        else if (totalScore >= 40) level = 'Eco Guardian';
        else if (totalScore >= 20) level = 'Green Warrior';
        else if (totalScore >= 10) level = 'Seed Planter';

        return {
            score: totalScore,
            maxScore: maxScore,
            percentage: Math.round((totalScore / maxScore) * 100),
            level: level,
            breakdown: {
                treeScore: Math.round(treeScore),
                co2Score: Math.round(co2Score),
                engagementScore: Math.round(engagementScore)
            }
        };
    }
};

// Gamification Levels
const GAMIFICATION_LEVELS = {
    'Seed Planter': { minScore: 0, maxScore: 19, color: '#8B7355', icon: '🌱' },
    'Green Warrior': { minScore: 20, maxScore: 39, color: '#4CAF50', icon: '🌿' },
    'Eco Guardian': { minScore: 40, maxScore: 59, color: '#2196F3', icon: '🛡️' },
    'Air Saver': { minScore: 60, maxScore: 79, color: '#FF9800', icon: '💨' },
    'Planet Protector': { minScore: 80, maxScore: 100, color: '#9C27B0', icon: '🌍' }
};

// Enhanced Achievements
const ENHANCED_ACHIEVEMENTS = {
    ...ACHIEVEMENTS,
    'Oxygen Producer': { oxygen: 7400 }, // 10 people's worth
    'Water Warrior': { trees: 50 }, // 50 trees planted
    'Cost Optimizer': { calculations: 20 }, // 20 optimized calculations
    'Multi-City Hero': { cities: 5 }, // Planted in 5 cities
    'Future Planner': { predictions: 10 } // Made 10 predictions
};


