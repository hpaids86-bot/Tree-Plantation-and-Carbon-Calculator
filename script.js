// EcoTree Impact Analyzer - Shared Utilities

// Tree species data with comprehensive attributes
// Formula: 1 adult needs ~740 kg oxygen per year

const DataSync = (() => {
    const DEFAULT_API_BASE = "http://127.0.0.1:5000/api";
    const origin = window.location.origin && window.location.origin !== "null"
        ? window.location.origin
        : null;
    const API_BASE = origin ? `${origin}/api` : DEFAULT_API_BASE;
    const PERSISTED_KEYS = new Set([
        "ecotree_calculations",
        "ecotree_map_pins",
        "ecotree_user_progress",
        "ecotree_achievements",
        "ecotree_users",
        "ecotree_goals",
        "ecotree_current_user",
        "ecotree_is_logged_in",
        "ecotree_login_time",
        "ecotree_last_city"
    ]);
    let serverAvailable = false;

    function bootstrap() {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `${API_BASE}/bootstrap`, false);
            xhr.send(null);

            if (xhr.status >= 200 && xhr.status < 300) {
                const payload = JSON.parse(xhr.responseText || "{}");
                const kv = payload?.data || {};
                Object.entries(kv).forEach(([key, storedValue]) => {
                    if (typeof storedValue === "string") {
                        localStorage.setItem(key, storedValue);
                    }
                });
                serverAvailable = true;
            }
        } catch (error) {
            console.warn("Data sync bootstrap unavailable:", error);
        }
    }

    function persist(key, serializedValue) {
        if (!serverAvailable || !PERSISTED_KEYS.has(key)) return;

        const body = JSON.stringify({ key, value: serializedValue });
        if (navigator.sendBeacon) {
            try {
                const blob = new Blob([body], { type: "application/json" });
                navigator.sendBeacon(`${API_BASE}/store`, blob);
                return;
            } catch (error) {
                console.warn("sendBeacon failed, falling back to fetch", error);
            }
        }

        fetch(`${API_BASE}/store`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        }).catch((error) => console.warn("Persist request failed:", error));
    }

    function remove(key) {
        if (!serverAvailable || !PERSISTED_KEYS.has(key)) return;
        fetch(`${API_BASE}/store/${encodeURIComponent(key)}`, {
            method: "DELETE",
        }).catch((error) => console.warn("Delete request failed:", error));
    }

    bootstrap();
    return {
        persist,
        remove,
        isAvailable: () => serverAvailable,
    };
})();

const TREE_SPECIES = {
    'Neem': {
        co2PerYear: 20,
        oxygenPerYear: 1750, // kg O2/year
        waterPerWeek: 18, // liters
        soilTypes: ['Sandy', 'Clay', 'Alluvial', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'High',
        lifespan: 200, // years
        costPerSapling: 45, // INR
        maintenanceCost: 200, // INR/year
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Mango': {
        co2PerYear: 22,
        oxygenPerYear: 1650,
        waterPerWeek: 45,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 300,
        costPerSapling: 120,
        maintenanceCost: 300,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Banyan': {
        co2PerYear: 48,
        oxygenPerYear: 2100,
        waterPerWeek: 25,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 500,
        costPerSapling: 80,
        maintenanceCost: 400,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Eucalyptus': {
        co2PerYear: 30,
        oxygenPerYear: 1800,
        waterPerWeek: 20,
        soilTypes: ['Sandy', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Temperate'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 150,
        costPerSapling: 40,
        maintenanceCost: 150,
        bestPlantingMonths: ['July', 'August', 'September'],
        survivalRisk: 'Low'
    },
    'Peepal': {
        co2PerYear: 45,
        oxygenPerYear: 2350,
        waterPerWeek: 22,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 2000,
        costPerSapling: 70,
        maintenanceCost: 250,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Bamboo': {
        co2PerYear: 40,
        oxygenPerYear: 1350,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Alluvial', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 120,
        costPerSapling: 30,
        maintenanceCost: 100,
        bestPlantingMonths: ['May', 'June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Oak': {
        co2PerYear: 25,
        oxygenPerYear: 1600,
        waterPerWeek: 30,
        soilTypes: ['Clay', 'Loamy'],
        climateZones: ['Temperate', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 400,
        costPerSapling: 150,
        maintenanceCost: 250,
        bestPlantingMonths: ['October', 'November', 'December'],
        survivalRisk: 'Medium'
    },
    'Teak': {
        co2PerYear: 28,
        oxygenPerYear: 1700,
        waterPerWeek: 35,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 250,
        costPerSapling: 110,
        maintenanceCost: 300,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Acacia': {
        co2PerYear: 15,
        oxygenPerYear: 1200,
        waterPerWeek: 12,
        soilTypes: ['Sandy', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 100,
        costPerSapling: 35,
        maintenanceCost: 100,
        bestPlantingMonths: ['July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Pine': {
        co2PerYear: 12,
        oxygenPerYear: 1100,
        waterPerWeek: 25,
        soilTypes: ['Sandy', 'Loamy'],
        climateZones: ['Temperate', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 150,
        costPerSapling: 90,
        maintenanceCost: 150,
        bestPlantingMonths: ['October', 'November', 'December', 'January'],
        survivalRisk: 'Medium'
    },
    'Cedar': {
        co2PerYear: 35,
        oxygenPerYear: 1900,
        waterPerWeek: 28,
        soilTypes: ['Loamy', 'Clay'],
        climateZones: ['Temperate', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 300,
        costPerSapling: 140,
        maintenanceCost: 350,
        bestPlantingMonths: ['October', 'November', 'December'],
        survivalRisk: 'Low'
    },
    'Gulmohar': {
        co2PerYear: 18,
        oxygenPerYear: 1400,
        waterPerWeek: 20,
        soilTypes: ['Sandy', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 80,
        costPerSapling: 55,
        maintenanceCost: 200,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Medium'
    },
    'Mahogany': {
        co2PerYear: 32,
        oxygenPerYear: 1850,
        waterPerWeek: 32,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 350,
        costPerSapling: 150,
        maintenanceCost: 400,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Jamun': {
        co2PerYear: 24,
        oxygenPerYear: 1550,
        waterPerWeek: 40,
        soilTypes: ['Alluvial', 'Clay'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 150,
        costPerSapling: 80,
        maintenanceCost: 250,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Arjun': {
        co2PerYear: 26,
        oxygenPerYear: 1680,
        waterPerWeek: 24,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'High',
        lifespan: 250,
        costPerSapling: 75,
        maintenanceCost: 220,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Low'
    },
    'Banyan Fig': {
        co2PerYear: 44,
        oxygenPerYear: 2050,
        waterPerWeek: 23,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 800,
        costPerSapling: 120,
        maintenanceCost: 350,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Guava': {
        co2PerYear: 18,
        oxygenPerYear: 1200,
        waterPerWeek: 30,
        soilTypes: ['Loamy', 'Alluvial'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 40,
        costPerSapling: 50,
        maintenanceCost: 100,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Lemon': {
        co2PerYear: 15,
        oxygenPerYear: 900,
        waterPerWeek: 25,
        soilTypes: ['Loamy', 'Sandy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 50,
        costPerSapling: 40,
        maintenanceCost: 120,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Papaya': {
        co2PerYear: 10,
        oxygenPerYear: 600,
        waterPerWeek: 35,
        soilTypes: ['Loamy', 'Sandy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Low',
        diseaseResistance: 'Low',
        lifespan: 4,
        costPerSapling: 25,
        maintenanceCost: 80,
        bestPlantingMonths: ['June', 'July'],
        survivalRisk: 'Medium'
    },
    'Curry Leaf': {
        co2PerYear: 8,
        oxygenPerYear: 500,
        waterPerWeek: 15,
        soilTypes: ['Loamy', 'Red'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 30,
        costPerSapling: 20,
        maintenanceCost: 50,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Drumstick': {
        co2PerYear: 25,
        oxygenPerYear: 1500,
        waterPerWeek: 10,
        soilTypes: ['Sandy', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 20,
        costPerSapling: 30,
        maintenanceCost: 50,
        bestPlantingMonths: ['June', 'July'],
        survivalRisk: 'Very Low'
    },
    'Amla': {
        co2PerYear: 22,
        oxygenPerYear: 1400,
        waterPerWeek: 20,
        soilTypes: ['Loamy', 'Alluvial', 'Clay'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 60,
        costPerSapling: 50,
        maintenanceCost: 80,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Custard Apple': {
        co2PerYear: 16,
        oxygenPerYear: 1000,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Rocky'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 25,
        costPerSapling: 45,
        maintenanceCost: 70,
        bestPlantingMonths: ['June', 'July'],
        survivalRisk: 'Low'
    },
    'Sapodilla': {
        co2PerYear: 20,
        oxygenPerYear: 1300,
        waterPerWeek: 30,
        soilTypes: ['Alluvial', 'Loamy'],
        climateZones: ['Tropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 80,
        costPerSapling: 60,
        maintenanceCost: 150,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Sandalwood': {
        co2PerYear: 29,
        oxygenPerYear: 1800,
        waterPerWeek: 25,
        soilTypes: ['Sandy', 'Loamy', 'Clay'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 80,
        costPerSapling: 150,
        maintenanceCost: 300,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Medium'
    },
    'Casuarina': {
        co2PerYear: 27,
        oxygenPerYear: 1620,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Saline', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 50,
        costPerSapling: 38,
        maintenanceCost: 100,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Tamarind': {
        co2PerYear: 26,
        oxygenPerYear: 1560,
        waterPerWeek: 20,
        soilTypes: ['Alluvial', 'Clay', 'Sandy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Very High',
        lifespan: 200,
        costPerSapling: 58,
        maintenanceCost: 150,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Very Low'
    },
    'Coconut': {
        co2PerYear: 22,
        oxygenPerYear: 1320,
        waterPerWeek: 50,
        soilTypes: ['Sandy', 'Alluvial', 'Loamy'],
        climateZones: ['Tropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 80,
        costPerSapling: 90,
        maintenanceCost: 200,
        bestPlantingMonths: ['June', 'July', 'August', 'September'],
        survivalRisk: 'Low'
    },
    'Jackfruit': {
        co2PerYear: 24,
        oxygenPerYear: 1440,
        waterPerWeek: 35,
        soilTypes: ['Alluvial', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 100,
        costPerSapling: 95,
        maintenanceCost: 250,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Pomegranate': {
        co2PerYear: 18,
        oxygenPerYear: 1080,
        waterPerWeek: 20,
        soilTypes: ['Loamy', 'Sandy', 'Alluvial'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 30,
        costPerSapling: 65,
        maintenanceCost: 120,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Sapota': {
        co2PerYear: 20,
        oxygenPerYear: 1200,
        waterPerWeek: 25,
        soilTypes: ['Loamy', 'Sandy', 'Alluvial'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 60,
        costPerSapling: 60,
        maintenanceCost: 150,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Palash': {
        co2PerYear: 19,
        oxygenPerYear: 1140,
        waterPerWeek: 12,
        soilTypes: ['Sandy', 'Clay', 'Rocky'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Very High',
        lifespan: 80,
        costPerSapling: 45,
        maintenanceCost: 100,
        bestPlantingMonths: ['July', 'August', 'September'],
        survivalRisk: 'Very Low'
    },
    'Amaltas': {
        co2PerYear: 20,
        oxygenPerYear: 1200,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Loamy', 'Clay'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 60,
        costPerSapling: 50,
        maintenanceCost: 120,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Kadam': {
        co2PerYear: 22,
        oxygenPerYear: 1320,
        waterPerWeek: 28,
        soilTypes: ['Alluvial', 'Clay', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 100,
        costPerSapling: 55,
        maintenanceCost: 180,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Shisham': {
        co2PerYear: 28,
        oxygenPerYear: 1680,
        waterPerWeek: 18,
        soilTypes: ['Alluvial', 'Sandy', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 120,
        costPerSapling: 80,
        maintenanceCost: 200,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Kachnar': {
        co2PerYear: 21,
        oxygenPerYear: 1260,
        waterPerWeek: 20,
        soilTypes: ['Loamy', 'Sandy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Medium',
        lifespan: 50,
        costPerSapling: 50,
        maintenanceCost: 120,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Baheda': {
        co2PerYear: 23,
        oxygenPerYear: 1380,
        waterPerWeek: 22,
        soilTypes: ['Loamy', 'Alluvial', 'Clay'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 150,
        costPerSapling: 55,
        maintenanceCost: 140,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Haritaki': {
        co2PerYear: 25,
        oxygenPerYear: 1500,
        waterPerWeek: 20,
        soilTypes: ['Loamy', 'Alluvial', 'Clay'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 150,
        costPerSapling: 60,
        maintenanceCost: 150,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Karanj': {
        co2PerYear: 24,
        oxygenPerYear: 1440,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Clay', 'Alluvial', 'Saline'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Very High',
        diseaseResistance: 'Very High',
        lifespan: 100,
        costPerSapling: 40,
        maintenanceCost: 100,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Very Low'
    },
    'Bael': {
        co2PerYear: 21,
        oxygenPerYear: 1260,
        waterPerWeek: 18,
        soilTypes: ['Sandy', 'Clay', 'Rocky'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'Very High',
        lifespan: 80,
        costPerSapling: 50,
        maintenanceCost: 120,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Mahua': {
        co2PerYear: 35,
        oxygenPerYear: 2100,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Rocky', 'Clay'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Very High',
        lifespan: 150,
        costPerSapling: 70,
        maintenanceCost: 130,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Very Low'
    },
    'Sal': {
        co2PerYear: 38,
        oxygenPerYear: 2280,
        waterPerWeek: 25,
        soilTypes: ['Loamy', 'Sandy', 'Clay'],
        climateZones: ['Subtropical', 'Temperate'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 200,
        costPerSapling: 110,
        maintenanceCost: 200,
        bestPlantingMonths: ['July', 'August', 'September'],
        survivalRisk: 'Medium'
    },
    'Deodar': {
        co2PerYear: 40,
        oxygenPerYear: 2400,
        waterPerWeek: 22,
        soilTypes: ['Mountain', 'Sandy', 'Loamy'],
        climateZones: ['Temperate'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 600,
        costPerSapling: 120,
        maintenanceCost: 250,
        bestPlantingMonths: ['September', 'October', 'November'],
        survivalRisk: 'Medium'
    },
    'Parijat': {
        co2PerYear: 14,
        oxygenPerYear: 840,
        waterPerWeek: 18,
        soilTypes: ['Loamy', 'Sandy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 40,
        costPerSapling: 35,
        maintenanceCost: 80,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Reetha': {
        co2PerYear: 20,
        oxygenPerYear: 1200,
        waterPerWeek: 16,
        soilTypes: ['Sandy', 'Loamy', 'Rocky'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 80,
        costPerSapling: 45,
        maintenanceCost: 100,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Portia': {
        co2PerYear: 22,
        oxygenPerYear: 1320,
        waterPerWeek: 20,
        soilTypes: ['Sandy', 'Saline', 'Loamy'],
        climateZones: ['Tropical'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 80,
        costPerSapling: 50,
        maintenanceCost: 110,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Champa': {
        co2PerYear: 12,
        oxygenPerYear: 720,
        waterPerWeek: 15,
        soilTypes: ['Sandy', 'Rocky', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical'],
        pollutionTolerance: 'Medium',
        diseaseResistance: 'High',
        lifespan: 50,
        costPerSapling: 40,
        maintenanceCost: 95,
        bestPlantingMonths: ['July', 'August'],
        survivalRisk: 'Low'
    },
    'Mulberry': {
        co2PerYear: 18,
        oxygenPerYear: 1080,
        waterPerWeek: 25,
        soilTypes: ['Alluvial', 'Loamy'],
        climateZones: ['Tropical', 'Subtropical', 'Temperate'],
        pollutionTolerance: 'High',
        diseaseResistance: 'Medium',
        lifespan: 75,
        costPerSapling: 40,
        maintenanceCost: 100,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    },
    'Moringa': {
        co2PerYear: 35,
        oxygenPerYear: 1950,
        waterPerWeek: 12,
        soilTypes: ['Sandy', 'Loamy', 'Rocky'],
        climateZones: ['Tropical', 'Subtropical', 'Arid'],
        pollutionTolerance: 'High',
        diseaseResistance: 'High',
        lifespan: 25,
        costPerSapling: 35,
        maintenanceCost: 60,
        bestPlantingMonths: ['June', 'July', 'August'],
        survivalRisk: 'Low'
    }
};

// Helper function to get tree data (backwards compatible)
function getTreeData(species) {
    const tree = TREE_SPECIES[species];
    if (!tree) return null;
    if (typeof tree === 'number') {
        // Legacy format - convert to new format
        return { co2PerYear: tree, oxygenPerYear: tree * 60 };
    }
    return tree;
}

// Achievement thresholds
const ACHIEVEMENTS = {
    'Seed Planter': { trees: 10, co2: 0 },
    'Eco Warrior': { trees: 100, co2: 0 },
    'City Saver': { trees: 0, co2: 1000 } // 1 tonne in kg
};

// LocalStorage Keys
const STORAGE_KEYS = {
    CALCULATIONS: 'ecotree_calculations',
    MAP_PINS: 'ecotree_map_pins',
    USER_PROGRESS: 'ecotree_user_progress',
    ACHIEVEMENTS: 'ecotree_achievements'
};

// LocalStorage Utilities
const Storage = {
    // Get data from localStorage
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    // Set data to localStorage
    set(key, value) {
        try {
            const serialized = JSON.stringify(value ?? null);
            localStorage.setItem(key, serialized);
            DataSync.persist(key, serialized);
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            DataSync.remove(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// Calculation Management
const Calculations = {
    // Save a calculation
    save(calculation) {
        const calculations = Storage.get(STORAGE_KEYS.CALCULATIONS, []);
        calculation.id = Date.now();
        calculation.timestamp = new Date().toISOString();
        calculations.push(calculation);
        Storage.set(STORAGE_KEYS.CALCULATIONS, calculations);
        this.updateProgress(calculation);
        return calculation;
    },

    // Get all calculations
    getAll() {
        return Storage.get(STORAGE_KEYS.CALCULATIONS, []);
    },

    // Get calculations by species
    getBySpecies(species) {
        return this.getAll().filter(calc => calc.species === species);
    },

    // Update user progress
    updateProgress(calculation) {
        const progress = Storage.get(STORAGE_KEYS.USER_PROGRESS, {
            totalTrees: 0,
            totalCO2: 0,
            speciesCount: {}
        });

        progress.totalTrees += calculation.count || 0;
        progress.totalCO2 += calculation.totalCO2 || 0;

        const species = calculation.species || 'Custom';
        progress.speciesCount[species] = (progress.speciesCount[species] || 0) + (calculation.count || 0);

        Storage.set(STORAGE_KEYS.USER_PROGRESS, progress);
        Achievements.checkAchievements(progress);
    },

    // Get user progress
    getProgress() {
        return Storage.get(STORAGE_KEYS.USER_PROGRESS, {
            totalTrees: 0,
            totalCO2: 0,
            speciesCount: {}
        });
    }
};

// Achievement System
const Achievements = {
    // Check and unlock achievements
    checkAchievements(progress) {
        const unlocked = Storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
        const newAchievements = [];

        for (const [name, threshold] of Object.entries(ACHIEVEMENTS)) {
            if (unlocked.includes(name)) continue;

            const treesMet = threshold.trees > 0 && progress.totalTrees >= threshold.trees;
            const co2Met = threshold.co2 > 0 && progress.totalCO2 >= threshold.co2;

            if (treesMet || co2Met) {
                unlocked.push(name);
                newAchievements.push(name);
            }
        }

        if (newAchievements.length > 0) {
            Storage.set(STORAGE_KEYS.ACHIEVEMENTS, unlocked);
            this.showAchievementNotification(newAchievements);
        }
    },

    // Show achievement notification
    showAchievementNotification(achievements) {
        achievements.forEach(achievement => {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'alert alert-success';
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.zIndex = '3000';
            notification.style.minWidth = '300px';
            notification.innerHTML = `
                <strong>🎉 Achievement Unlocked!</strong><br>
                ${achievement}
            `;
            document.body.appendChild(notification);

            // Remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
        });
    },

    // Get all unlocked achievements
    getUnlocked() {
        return Storage.get(STORAGE_KEYS.ACHIEVEMENTS, []);
    }
};

// Map Pins Management (deprecated - map feature removed)
const MapPins = {
    save() {
        console.warn('MapPins.save is deprecated. Map feature has been removed.');
        return null;
    },
    getAll() {
        return [];
    },
    getByLocation() {
        return [];
    },
    delete() {
        return true;
    }
};

// Leaderboard System
const Leaderboard = {
    // Get city leaderboard
    getCityLeaderboard() {
        const calculations = Calculations.getAll();
        const cityData = {};

        calculations.forEach(calc => {
            const city = calc.location || 'Unknown';
            if (!cityData[city]) {
                cityData[city] = { trees: 0, co2: 0 };
            }
            cityData[city].trees += calc.count || 0;
            cityData[city].co2 += calc.totalCO2 || 0;
        });

        // Convert to array and sort
        const leaderboard = Object.entries(cityData).map(([city, data]) => ({
            city,
            trees: data.trees,
            co2: data.co2
        }));

        return leaderboard.sort((a, b) => b.co2 - a.co2);
    },

    // Get top performing species
    getTopSpecies(limit = 5) {
        const progress = Calculations.getProgress();
        const speciesArray = Object.entries(progress.speciesCount || {})
            .map(([species, count]) => ({ species, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

        return speciesArray;
    }
};

// Utility Functions
const Utils = {
    // Format number with commas
    formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    },

    // Convert kg to tonnes
    kgToTonnes(kg) {
        return (kg / 1000).toFixed(2);
    },

    // Calculate car equivalents (4.6 tonnes per car per year)
    calculateCarEquivalents(co2Tonnes) {
        return (co2Tonnes / 4.6).toFixed(2);
    },

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },

    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Show alert
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;

        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alertDiv, container.firstChild);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
};

// Initialize achievements check on page load
document.addEventListener('DOMContentLoaded', () => {
    const progress = Calculations.getProgress();
    Achievements.checkAchievements(progress);
});

