// EcoTree AI – Premium Modules
// All research-level engines for Green City Score, ROI Analyzer, Impact Dashboard, Heatmap

/* ================================================
   DARK MODE TOGGLE
   ================================================ */
const DarkModeToggle = (() => {
    const STORAGE_KEY = 'ecotree_theme';

    function getTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        const btn = document.getElementById('darkModeBtn');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
        }
    }

    function toggle() {
        const current = getTheme();
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    function init() {
        applyTheme(getTheme());
        const btn = document.getElementById('darkModeBtn');
        if (btn) btn.addEventListener('click', toggle);
    }

    return { init, toggle, getTheme };
})();

/* ================================================
   COUNT-UP ANIMATOR
   ================================================ */
const CountUpAnimator = (() => {
    function animate(el, target, duration = 2000, suffix = '', prefix = '') {
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const value = Math.floor(startVal + (target - startVal) * eased);
            el.textContent = prefix + value.toLocaleString('en-IN') + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    function animateAll() {
        document.querySelectorAll('[data-countup]').forEach(el => {
            const target = parseFloat(el.dataset.countup) || 0;
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const duration = parseInt(el.dataset.duration) || 2000;
            animate(el, target, duration, suffix, prefix);
        });
    }

    return { animate, animateAll };
})();

/* ================================================
   SCROLL REVEAL
   ================================================ */
const ScrollReveal = (() => {
    let observer;

    function init() {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                        // Trigger count-ups inside revealed elements
                        entry.target.querySelectorAll('[data-countup]').forEach(el => {
                            const target = parseFloat(el.dataset.countup) || 0;
                            const suffix = el.dataset.suffix || '';
                            const prefix = el.dataset.prefix || '';
                            CountUpAnimator.animate(el, target, 1800, suffix, prefix);
                        });
                        // Trigger progress bars
                        entry.target.querySelectorAll('.progress-bar-fill, .survival-bar-fill, .distribution-bar-fill').forEach(bar => {
                            const width = bar.dataset.width || bar.style.getPropertyValue('--target-width') || '0%';
                            setTimeout(() => { bar.style.width = width; }, 200);
                        });
                    }, i * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-up, .fade-in, .slide-left, .counter-box, .roi-metric-card, .score-metric-card').forEach(el => {
            observer.observe(el);
        });
    }

    return { init };
})();

/* ================================================
   GREEN CITY SCORE ENGINE
   ================================================ */
const GreenCityScore = (() => {
    // City baseline data for comparison
    const CITY_BASELINES = [
        { name: 'Mysore', aqi: 68, greenCover: 42, treeDensity: 380, pop: 0.9 },
        { name: 'Shimla', aqi: 58, greenCover: 55, treeDensity: 420, pop: 0.17 },
        { name: 'Kochi', aqi: 72, greenCover: 38, treeDensity: 320, pop: 0.7 },
        { name: 'Bangalore', aqi: 95, greenCover: 28, treeDensity: 220, pop: 12 },
        { name: 'Pune', aqi: 85, greenCover: 30, treeDensity: 250, pop: 5 },
        { name: 'Chennai', aqi: 120, greenCover: 20, treeDensity: 180, pop: 10 },
        { name: 'Hyderabad', aqi: 110, greenCover: 22, treeDensity: 190, pop: 10 },
        { name: 'Mumbai', aqi: 180, greenCover: 12, treeDensity: 90, pop: 22 },
        { name: 'Ahmedabad', aqi: 155, greenCover: 10, treeDensity: 110, pop: 8 },
        { name: 'Delhi', aqi: 342, greenCover: 8, treeDensity: 60, pop: 30 },
    ];

    function calculate(aqi, treeDensityPer1000, population, greenCoverPct) {
        // Normalize each factor 0–100
        const aqiScore = Math.max(0, 100 - (aqi / 5));             // AQI 0=100pts, 500=0pts
        const treeScore = Math.min(100, (treeDensityPer1000 / 5)); // 500/1000 = 100pts
        const popScore = Math.max(0, 100 - (population / 0.4));    // 40M pop = 0pts
        const greenScore = Math.min(100, greenCoverPct * 2);       // 50% = 100pts

        const weighted = (aqiScore * 0.35) + (treeScore * 0.30) + (greenScore * 0.25) + (popScore * 0.10);
        const final = Math.round(Math.max(0, Math.min(100, weighted)));

        return {
            score: final,
            aqiScore: Math.round(aqiScore),
            treeScore: Math.round(treeScore),
            greenScore: Math.round(greenScore),
            popScore: Math.round(popScore),
            badge: getBadge(final),
            recommendation: getRecommendation(final)
        };
    }

    function getBadge(score) {
        if (score >= 90) return { label: '🏆 Eco Champion', cls: 'badge-eco-champion' };
        if (score >= 75) return { label: '🌿 Green City', cls: 'badge-green-city' };
        if (score >= 60) return { label: '📈 Improving', cls: 'badge-improving' };
        if (score >= 40) return { label: '⚠️ Vulnerable', cls: 'badge-vulnerable' };
        return { label: '🚨 Critical', cls: 'badge-critical' };
    }

    function getRecommendation(score) {
        if (score >= 90) return 'Excellent sustainability! Maintain current green infrastructure and serve as a model city.';
        if (score >= 75) return 'Good environmental health. Focus on expanding green corridors and reducing PM2.5.';
        if (score >= 60) return 'Moderate performance. Urgently plant 10,000+ trees in high-density zones and improve green cover.';
        if (score >= 40) return 'Vulnerable zone. Implement emergency plantation drives and restrict polluting industries.';
        return 'Critical status. City needs immediate intervention: massive forestation, pollution controls, and green policy.';
    }

    function getComparisonData() {
        return CITY_BASELINES.map(c => ({
            ...c,
            ...calculate(c.aqi, c.treeDensity, c.pop, c.greenCover)
        })).sort((a, b) => b.score - a.score);
    }

    return { calculate, getBadge, getComparisonData };
})();

/* ================================================
   ROI ANALYZER ENGINE
   ================================================ */
const ROIAnalyzer = (() => {
    const SPECIES_DATA = {
        'Neem':             { co2: 20, cooling: 7, water: 4200, biodiversity: 75, survival: 0.92, cost: 45 },
        'Peepal':           { co2: 45, cooling: 9, water: 5800, biodiversity: 90, survival: 0.95, cost: 70 },
        'Banyan':           { co2: 48, cooling: 9, water: 6000, biodiversity: 95, survival: 0.96, cost: 80 },
        'Mango':            { co2: 22, cooling: 6, water: 4500, biodiversity: 70, survival: 0.88, cost: 120 },
        'Tamarind':         { co2: 26, cooling: 7, water: 4800, biodiversity: 72, survival: 0.94, cost: 58 },
        'Teak':             { co2: 28, cooling: 6, water: 4200, biodiversity: 65, survival: 0.87, cost: 110 },
        'Bamboo':           { co2: 40, cooling: 5, water: 3500, biodiversity: 60, survival: 0.91, cost: 30 },
        'Moringa':          { co2: 35, cooling: 5, water: 3800, biodiversity: 58, survival: 0.90, cost: 35 },
        'Casuarina':        { co2: 27, cooling: 5, water: 3200, biodiversity: 55, survival: 0.89, cost: 38 },
        'Eucalyptus':       { co2: 30, cooling: 4, water: 2800, biodiversity: 45, survival: 0.90, cost: 40 },
        'Jamun':            { co2: 24, cooling: 7, water: 4600, biodiversity: 78, survival: 0.88, cost: 80 },
        'Arjun':            { co2: 26, cooling: 7, water: 4400, biodiversity: 76, survival: 0.89, cost: 75 },
        'Indian Rosewood':  { co2: 32, cooling: 8, water: 5200, biodiversity: 82, survival: 0.87, cost: 140 },
        'Amla':             { co2: 22, cooling: 6, water: 4000, biodiversity: 74, survival: 0.88, cost: 50 },
        'Mahogany':         { co2: 32, cooling: 7, water: 4800, biodiversity: 78, survival: 0.86, cost: 150 },
        'Ashoka':           { co2: 18, cooling: 6, water: 3800, biodiversity: 70, survival: 0.87, cost: 60 },
        'Kadamba':          { co2: 22, cooling: 7, water: 4500, biodiversity: 75, survival: 0.88, cost: 55 },
        'Gulmohar':         { co2: 18, cooling: 6, water: 3600, biodiversity: 65, survival: 0.85, cost: 55 },
        'Pongamia':         { co2: 24, cooling: 7, water: 4200, biodiversity: 76, survival: 0.92, cost: 50 },
        'Jackfruit':        { co2: 24, cooling: 7, water: 4600, biodiversity: 79, survival: 0.87, cost: 95 },
        'Coconut':          { co2: 22, cooling: 5, water: 3800, biodiversity: 60, survival: 0.85, cost: 90 },
        'Palmyra':          { co2: 20, cooling: 5, water: 3200, biodiversity: 62, survival: 0.88, cost: 85 },
        'Drumstick':        { co2: 25, cooling: 5, water: 3400, biodiversity: 68, survival: 0.93, cost: 30 },
        'Bael':             { co2: 21, cooling: 6, water: 3900, biodiversity: 72, survival: 0.90, cost: 50 },
        'Karanj':           { co2: 24, cooling: 6, water: 3800, biodiversity: 70, survival: 0.94, cost: 40 },
        'Silver Oak':       { co2: 30, cooling: 7, water: 4500, biodiversity: 68, survival: 0.88, cost: 75 },
        'Rain Tree':        { co2: 35, cooling: 9, water: 5500, biodiversity: 88, survival: 0.90, cost: 90 },
        'Wild Almond':      { co2: 28, cooling: 8, water: 5000, biodiversity: 82, survival: 0.89, cost: 65 },
        'Indian Cork Tree': { co2: 22, cooling: 6, water: 4000, biodiversity: 70, survival: 0.87, cost: 70 },
        'Peltophorum':      { co2: 26, cooling: 7, water: 4400, biodiversity: 72, survival: 0.88, cost: 60 },
    };

    function analyze(numTrees, species, years, city) {
        const data = SPECIES_DATA[species] || SPECIES_DATA['Neem'];
        const survivalFactor = getSurvivalFactor(species, city);
        const effectiveTrees = numTrees * survivalFactor.overall;

        const carbonCaptured = effectiveTrees * data.co2 * years;                  // kg
        const coolingImpact = (effectiveTrees * data.cooling * years) / 10000;     // °C-equivalent
        const waterRetained = effectiveTrees * data.water * years;                  // liters
        const biodiversityScore = Math.min(100, data.biodiversity + (years * 0.5));
        const totalCost = numTrees * data.cost;
        const envValue = (carbonCaptured * 2.5) + (waterRetained * 0.001) + (coolingImpact * 50000);
        const roi = totalCost > 0 ? Math.round(((envValue - totalCost) / totalCost) * 100) : 0;
        const ebi = calcEBI(data, years, survivalFactor.overall);
        const successScore = calcSuccessScore(data, city, years);

        return {
            carbonCaptured: Math.round(carbonCaptured),
            carbonTonnes: (carbonCaptured / 1000).toFixed(2),
            coolingImpact: coolingImpact.toFixed(2),
            waterRetained: Math.round(waterRetained),
            biodiversityScore: Math.round(biodiversityScore),
            roi,
            ebi: Math.round(ebi),
            successScore,
            survivalFactor,
            oxygenGenerated: Math.round(effectiveTrees * 740 * years / 10),  // kg per year avg
            timeline: generateTimeline(numTrees, data, years, survivalFactor.overall)
        };
    }

    function generateTimeline(numTrees, data, years, survival) {
        const labels = [], carbon = [], cooling = [], water = [];
        for (let y = 1; y <= Math.min(years, 50); y++) {
            labels.push(`Yr ${y}`);
            carbon.push(Math.round(numTrees * survival * data.co2 * y));
            cooling.push(parseFloat(((numTrees * survival * data.cooling * y) / 10000).toFixed(2)));
            water.push(Math.round(numTrees * survival * data.water * y / 1000)); // kiloliters
        }
        return { labels, carbon, cooling, water };
    }

    function calcEBI(data, years, survival) {
        const carbonScore = Math.min(100, (data.co2 / 50) * 100);
        const coolingScore = (data.cooling / 10) * 100;
        const biodivScore = data.biodiversity;
        const waterScore = Math.min(100, (data.water / 60) * 100);
        const yearFactor = Math.min(1.5, 1 + (years * 0.01));
        return Math.min(100, ((carbonScore + coolingScore + biodivScore + waterScore) / 4) * yearFactor * survival);
    }

    function calcSuccessScore(data, city, years) {
        let score = 60;
        score += data.survival > 0.9 ? 15 : data.survival > 0.85 ? 8 : 0;
        score += years >= 10 ? 10 : years >= 5 ? 5 : 2;
        if (city && typeof INDIAN_CITIES !== 'undefined' && INDIAN_CITIES[city]) {
            const rainfall = INDIAN_CITIES[city].rainfall || 800;
            if (rainfall > 1200) score += 10;
            else if (rainfall > 800) score += 6;
            else if (rainfall < 500) score -= 5;
        }
        return Math.min(100, Math.max(0, score));
    }

    function getSurvivalFactor(species, city) {
        const data = SPECIES_DATA[species] || SPECIES_DATA['Neem'];
        let climateFactor = 0.85, soilFactor = 0.88, rainfallFactor = 0.85;

        if (city && typeof INDIAN_CITIES !== 'undefined' && INDIAN_CITIES[city]) {
            const c = INDIAN_CITIES[city];
            rainfallFactor = c.rainfall > 1500 ? 0.95 : c.rainfall > 800 ? 0.90 : c.rainfall > 500 ? 0.82 : 0.70;
            climateFactor = (c.zone === 'Tropical') ? 0.92 : (c.zone === 'Subtropical') ? 0.88 : 0.80;
        }

        const overall = Math.min(1, (data.survival * 0.5 + climateFactor * 0.25 + soilFactor * 0.1 + rainfallFactor * 0.15));
        return {
            species: Math.round(data.survival * 100),
            climate: Math.round(climateFactor * 100),
            soil: Math.round(soilFactor * 100),
            rainfall: Math.round(rainfallFactor * 100),
            overall: parseFloat(overall.toFixed(2))
        };
    }

    return { analyze, getSurvivalFactor, SPECIES_DATA };
})();

/* ================================================
   IMPACT DASHBOARD ENGINE
   ================================================ */
const ImpactDashboard = (() => {
    // Platform-wide simulated impact data
    const PLATFORM_DATA = {
        treesPlanted:       124750,
        co2Absorbed:        3720000,    // kg
        tempReduced:        8430,       // °C units (cumulative)
        pollutionReduced:   2150000,    // AQI reduction events
        oxygenGenerated:    92000000,   // kg
        waterConserved:     565000000,  // liters
    };

    const MONTHLY_DATA = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        trees:  [3200, 4100, 5800, 7200, 9800, 15600, 18400, 16200, 12400, 9800, 6200, 4150],
        co2:    [48000, 61500, 87000, 108000, 147000, 234000, 276000, 243000, 186000, 147000, 93000, 62250],
    };

    function addUserData(trees, species) {
        if (!trees || trees <= 0) return PLATFORM_DATA;
        const co2Rate = 22; // avg kg/year
        return {
            treesPlanted: PLATFORM_DATA.treesPlanted + parseInt(trees),
            co2Absorbed: PLATFORM_DATA.co2Absorbed + (trees * co2Rate * 10),
            tempReduced: PLATFORM_DATA.tempReduced + Math.round(trees * 0.068),
            pollutionReduced: PLATFORM_DATA.pollutionReduced + Math.round(trees * 17),
            oxygenGenerated: PLATFORM_DATA.oxygenGenerated + (trees * 740),
            waterConserved: PLATFORM_DATA.waterConserved + (trees * 4500),
        };
    }

    return { PLATFORM_DATA, MONTHLY_DATA, addUserData };
})();

/* ================================================
   HEATMAP ENGINE
   ================================================ */
const HeatmapEngine = (() => {
    function getCityZone(aqi) {
        if (aqi <= 100) return 'green';
        if (aqi <= 200) return 'moderate';
        return 'high';
    }

    function buildTopPollutedData(limit = 20) {
        if (typeof INDIAN_CITIES === 'undefined') return { labels: [], aqi: [], pm25: [] };
        const sorted = Object.entries(INDIAN_CITIES)
            .filter(([, d]) => d.aqi)
            .sort(([, a], [, b]) => b.aqi - a.aqi)
            .slice(0, limit);

        return {
            labels: sorted.map(([name]) => name),
            aqi: sorted.map(([, d]) => d.aqi),
            pm25: sorted.map(([, d]) => d.pm25 || 0),
            pm10: sorted.map(([, d]) => d.pm10 || 0),
        };
    }

    function buildTier1Data() {
        const tier1 = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];
        if (typeof INDIAN_CITIES === 'undefined') return { labels: tier1, aqi: [], pm25: [], pm10: [] };
        return {
            labels: tier1,
            aqi: tier1.map(c => INDIAN_CITIES[c]?.aqi || 0),
            pm25: tier1.map(c => INDIAN_CITIES[c]?.pm25 || 0),
            pm10: tier1.map(c => INDIAN_CITIES[c]?.pm10 || 0),
        };
    }

    function buildBubbleData() {
        if (typeof INDIAN_CITIES === 'undefined') return [];
        const cityPops = {
            'Delhi': 30, 'Mumbai': 22, 'Bangalore': 12, 'Chennai': 10, 'Hyderabad': 10,
            'Kolkata': 14, 'Pune': 5, 'Ahmedabad': 8, 'Jaipur': 4, 'Surat': 6,
            'Lucknow': 3.5, 'Kanpur': 3, 'Nagpur': 2.5, 'Indore': 2, 'Bhopal': 2,
            'Coimbatore': 1.5, 'Madurai': 1.5, 'Vijayawada': 1.5, 'Visakhapatnam': 1.7
        };
        return Object.entries(cityPops).map(([city, pop]) => ({
            x: INDIAN_CITIES[city]?.aqi || 80,
            y: pop,
            r: Math.max(5, (INDIAN_CITIES[city]?.pm25 || 40) / 8),
            label: city
        }));
    }

    function classifyCities() {
        if (typeof INDIAN_CITIES === 'undefined') return { green: [], moderate: [], high: [] };
        const zones = { green: [], moderate: [], high: [] };
        Object.entries(INDIAN_CITIES).forEach(([name, d]) => {
            zones[getCityZone(d.aqi || 80)].push(name);
        });
        return zones;
    }

    return { buildTopPollutedData, buildTier1Data, buildBubbleData, classifyCities, getCityZone };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    DarkModeToggle.init();
    ScrollReveal.init();
    document.body.classList.add('page-enter');
});
